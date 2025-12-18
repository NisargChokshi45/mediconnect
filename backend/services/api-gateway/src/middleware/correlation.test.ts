import { correlationIdMiddleware } from './correlation';
import { v4 as uuidv4 } from 'uuid';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid'),
}));

describe('correlationIdMiddleware', () => {
  let mockRequest: any;
  let mockResponse: any;
  let nextFunction: any;

  beforeEach(() => {
    mockRequest = {
      headers: {},
    };
    mockResponse = {
      setHeader: jest.fn(),
    };
    nextFunction = jest.fn();
    jest.clearAllMocks();
  });

  it('should generate a new correlation id if one does not exist', () => {
    correlationIdMiddleware(mockRequest, mockResponse, nextFunction);
    expect(mockRequest.headers['x-correlation-id']).toBe('test-uuid');
    expect(mockResponse.setHeader).toHaveBeenCalledWith('x-correlation-id', 'test-uuid');
    expect(nextFunction).toHaveBeenCalled();
  });

  it('should use existing correlation id if it exists', () => {
    mockRequest.headers['x-correlation-id'] = 'existing-uuid';
    correlationIdMiddleware(mockRequest, mockResponse, nextFunction);
    expect(mockRequest.headers['x-correlation-id']).toBe('existing-uuid');
    expect(mockResponse.setHeader).toHaveBeenCalledWith('x-correlation-id', 'existing-uuid');
    expect(nextFunction).toHaveBeenCalled();
  });
});
