import { validateRequest } from './validation';
import { z } from 'zod';

describe('validateRequest Middleware', () => {
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

  it('should call next if validation passes', () => {
    const schema = z.object({ id: z.string() });
    mockRequest.body = { id: 'test' };
    validateRequest(schema)(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
  });

  it('should return 400 if validation fails', () => {
    const schema = z.object({ id: z.string() });
    mockRequest.body = { id: 123 };
    validateRequest(schema)(mockRequest, mockResponse, nextFunction);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
  });
});
