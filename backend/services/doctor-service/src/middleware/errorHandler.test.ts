import { errorHandler } from './errorHandler';

jest.mock('../utils/logger', () => ({
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

  it('should handle DOCTOR_ALREADY_EXISTS', () => {
    const err = new Error('DOCTOR_ALREADY_EXISTS');
    errorHandler(err, mockRequest, mockResponse, nextFunction);
    expect(mockResponse.status).toHaveBeenCalledWith(409);
  });

  it('should handle DOCTOR_NOT_FOUND', () => {
    const err = new Error('DOCTOR_NOT_FOUND');
    errorHandler(err, mockRequest, mockResponse, nextFunction);
    expect(mockResponse.status).toHaveBeenCalledWith(404);
  });

  it('should handle generic error', () => {
    const err = new Error('Some other error');
    errorHandler(err, mockRequest, mockResponse, nextFunction);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
  });
});
