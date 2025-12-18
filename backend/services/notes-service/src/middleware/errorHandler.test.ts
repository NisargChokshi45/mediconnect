import { errorHandler } from './errorHandler';

jest.mock('../../../../shared/logger', () => ({
  createLogger: () => ({ error: jest.fn() }),
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

  it('should handle NOTE_NOT_FOUND', () => {
    errorHandler(new Error('NOTE_NOT_FOUND'), mockRequest, mockResponse, nextFunction);
    expect(mockResponse.status).toHaveBeenCalledWith(404);
  });

  it('should handle UNAUTHORIZED_DOCTOR', () => {
    errorHandler(new Error('UNAUTHORIZED_DOCTOR'), mockRequest, mockResponse, nextFunction);
    expect(mockResponse.status).toHaveBeenCalledWith(403);
  });

  it('should handle APPOINTMENT_NOT_FOUND', () => {
    errorHandler(new Error('APPOINTMENT_NOT_FOUND'), mockRequest, mockResponse, nextFunction);
    expect(mockResponse.status).toHaveBeenCalledWith(404);
  });

  it('should handle generic error', () => {
    errorHandler(new Error('Other'), mockRequest, mockResponse, nextFunction);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
  });
});
