
import app from './app';
import { AppDataSource } from './config/database';

jest.mock('./app', () => ({
  listen: jest.fn(),
}));

jest.mock('./config/database', () => ({
  AppDataSource: {
    initialize: jest.fn(),
    destroy: jest.fn(),
  },
}));

jest.mock('../../../shared/logger', () => ({
  createLogger: () => ({
    info: jest.fn(),
    error: jest.fn(),
  }),
}));

describe('Server', () => {
  let mockListen: jest.Mock;
  let mockInitialize: jest.Mock;
  let mockDestroy: jest.Mock;
  let mockExit: jest.SpyInstance;
  let mockOn: jest.SpyInstance;

  beforeEach(() => {
    jest.resetAllMocks();
    
    mockListen = app.listen as jest.Mock;
    mockInitialize = AppDataSource.initialize as jest.Mock;
    mockDestroy = AppDataSource.destroy as jest.Mock;
    mockExit = jest.spyOn(process, 'exit').mockImplementation(() => undefined as never);
    mockOn = jest.spyOn(process, 'on').mockImplementation();
  });

  afterEach(() => {
    mockExit.mockRestore();
    mockOn.mockRestore();
  });

  it('should start server successfully', async () => {
    mockInitialize.mockResolvedValue(undefined);
    mockListen.mockImplementation((port, cb) => {
      cb();
      return { close: jest.fn() };
    });

    const { bootstrap } = require('./server');
    await bootstrap();

    expect(mockInitialize).toHaveBeenCalled();
    expect(mockListen).toHaveBeenCalled();
    expect(mockOn).toHaveBeenCalledWith('SIGTERM', expect.any(Function));
    expect(mockOn).toHaveBeenCalledWith('SIGINT', expect.any(Function));
  });

  it('should handle startup error', async () => {
    const error = new Error('Startup failed');
    mockInitialize.mockRejectedValue(error);

    const { bootstrap } = require('./server');
    await bootstrap();

    expect(mockExit).toHaveBeenCalledWith(1);
  });

  it('should handle graceful shutdown', async () => {
    const mockClose = jest.fn().mockImplementation((cb) => cb());
    mockListen.mockImplementation((port, cb) => {
      cb();
      return { close: mockClose };
    });
    mockInitialize.mockResolvedValue(undefined);

    const { bootstrap } = require('./server');
    await bootstrap();

    const shutdownHandler = mockOn.mock.calls.find(call => call[0] === 'SIGTERM')[1];
    await shutdownHandler();

    expect(mockClose).toHaveBeenCalled();
    expect(mockDestroy).toHaveBeenCalled();
    expect(mockExit).toHaveBeenCalledWith(0);
  });
});
