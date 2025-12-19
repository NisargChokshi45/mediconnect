import app from './app';

jest.mock('./app', () => ({
  listen: jest.fn(),
}));

jest.mock('../../../shared/logger', () => ({
  createLogger: () => ({
    info: jest.fn(),
    error: jest.fn(),
  }),
}));

describe('Server', () => {
  let mockListen: jest.Mock;
  let mockExit: jest.SpyInstance;
  let mockOn: jest.SpyInstance;

  beforeEach(() => {
    jest.resetAllMocks();

    mockListen = app.listen as jest.Mock;
    mockExit = jest.spyOn(process, 'exit').mockImplementation(() => undefined as never);
    mockOn = jest.spyOn(process, 'on').mockImplementation();
  });

  afterEach(() => {
    mockExit.mockRestore();
    mockOn.mockRestore();
  });

  it('should start server successfully', async () => {
    mockListen.mockImplementation((port, cb) => {
      cb();
      return { close: jest.fn() };
    });

    const { bootstrap } = require('./server');
    await bootstrap();

    expect(mockListen).toHaveBeenCalled();
    expect(mockOn).toHaveBeenCalledWith('SIGTERM', expect.any(Function));
    expect(mockOn).toHaveBeenCalledWith('SIGINT', expect.any(Function));
  });

  it('should handle startup error', async () => {
    mockListen.mockImplementation(() => {
      throw new Error('Startup failed');
    });

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

    const { bootstrap } = require('./server');
    await bootstrap();

    const shutdownHandler = mockOn.mock.calls.find((call) => call[0] === 'SIGTERM')[1];
    await shutdownHandler();

    expect(mockClose).toHaveBeenCalled();
    expect(mockExit).toHaveBeenCalledWith(0);
  });
});
