import { errorHandler, AppError } from './errorHandler';

jest.mock('../../../../shared/logger', () => ({
  createLogger: () => ({
    error: jest.fn(),
  }),
}));

describe('errorHandler Middleware', () => {
  let mockRequest: any;
  let mockResponse: any;
  let nextFunction: any;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
  });

  it('should handle AppError', () => {
    const err = new AppError('TEST_CODE', 'test message', 418);
    errorHandler(err, mockRequest, mockResponse, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(418);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      error: { code: 'TEST_CODE', message: 'test message' },
    });
  });

  it('should handle AppError with default status code', () => {
    const err = new AppError('DEFAULT_CODE', 'default message');
    errorHandler(err, mockRequest, mockResponse, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      error: { code: 'DEFAULT_CODE', message: 'default message' },
    });
  });

  it('should handle USER_ALREADY_EXISTS', () => {
    const err = new Error('USER_ALREADY_EXISTS');
    errorHandler(err, mockRequest, mockResponse, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(409);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({ code: 'USER_ALREADY_EXISTS' }),
      })
    );
  });

  it('should handle INVALID_CREDENTIALS', () => {
    const err = new Error('INVALID_CREDENTIALS');
    errorHandler(err, mockRequest, mockResponse, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({ code: 'INVALID_CREDENTIALS' }),
      })
    );
  });

  it('should handle USER_INACTIVE', () => {
    const err = new Error('USER_INACTIVE');
    errorHandler(err, mockRequest, mockResponse, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({ code: 'USER_INACTIVE' }),
      })
    );
  });

  it('should handle INVALID_TOKEN', () => {
    const err = new Error('INVALID_TOKEN');
    errorHandler(err, mockRequest, mockResponse, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({ code: 'INVALID_TOKEN' }),
      })
    );
  });

  it('should handle generic error', () => {
    const err = new Error('Some other error');
    errorHandler(err, mockRequest, mockResponse, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' },
    });
  });
});
