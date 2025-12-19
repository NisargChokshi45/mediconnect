import { errorHandler } from './errorHandler';

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

  it('should handle PATIENT_ALREADY_EXISTS', () => {
    const err = new Error('PATIENT_ALREADY_EXISTS');
    errorHandler(err, mockRequest, mockResponse, nextFunction);
    expect(mockResponse.status).toHaveBeenCalledWith(409);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({ code: 'PATIENT_ALREADY_EXISTS' }),
      })
    );
  });

  it('should handle PATIENT_NOT_FOUND', () => {
    const err = new Error('PATIENT_NOT_FOUND');
    errorHandler(err, mockRequest, mockResponse, nextFunction);
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({ code: 'PATIENT_NOT_FOUND' }),
      })
    );
  });

  it('should handle UPDATE_FAILED', () => {
    const err = new Error('UPDATE_FAILED');
    errorHandler(err, mockRequest, mockResponse, nextFunction);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({ code: 'UPDATE_FAILED' }),
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
