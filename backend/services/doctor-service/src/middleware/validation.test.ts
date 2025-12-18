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

  it('should call next() if validation passes', () => {
    const schema = z.object({ name: z.string() });
    mockRequest.body = { name: 'Test' };
    const middleware = validateRequest(schema);
    middleware(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
  });

  it('should return 400 if validation fails', () => {
    const schema = z.object({ name: z.string() });
    mockRequest.body = { name: 123 };
    const middleware = validateRequest(schema);
    middleware(mockRequest, mockResponse, nextFunction);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
  });

  it('should call next(error) if unexpected error', () => {
      const schema = { parse: () => { throw new Error('Unk'); } } as any;
      const middleware = validateRequest(schema);
      middleware(mockRequest, mockResponse, nextFunction);
      expect(nextFunction).toHaveBeenCalledWith(expect.any(Error));
  });
});
