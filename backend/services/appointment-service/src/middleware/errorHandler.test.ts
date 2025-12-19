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

  it('should handle APPOINTMENT_NOT_FOUND', () => {
    errorHandler(new Error('APPOINTMENT_NOT_FOUND'), mockRequest, mockResponse, nextFunction);
    expect(mockResponse.status).toHaveBeenCalledWith(404);
  });

  it('should handle PATIENT_NOT_FOUND', () => {
    errorHandler(new Error('PATIENT_NOT_FOUND'), mockRequest, mockResponse, nextFunction);
    expect(mockResponse.status).toHaveBeenCalledWith(404);
  });

  it('should handle DOCTOR_NOT_FOUND', () => {
    errorHandler(new Error('DOCTOR_NOT_FOUND'), mockRequest, mockResponse, nextFunction);
    expect(mockResponse.status).toHaveBeenCalledWith(404);
  });

  it('should handle generic error', () => {
    errorHandler(new Error('Other'), mockRequest, mockResponse, nextFunction);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
  });
});
