import { correlationIdMiddleware } from './correlation';
import { v4 as uuidv4 } from 'uuid';

jest.mock('uuid');
const mockedUuidv4 = uuidv4 as jest.MockedFunction<typeof uuidv4>;

describe('Correlation Middleware', () => {
  let mockRequest: any;
  let mockResponse: any;
  let nextFunctionAtfer: jest.Mock;

  beforeEach(() => {
    mockRequest = {
      headers: {},
    };
    mockResponse = {
      setHeader: jest.fn(),
    };
    nextFunctionAtfer = jest.fn();
    jest.clearAllMocks();
  });

  it('should generate a new correlation ID if not present in headers', () => {
    mockedUuidv4.mockReturnValue('new-uuid');

    correlationIdMiddleware(mockRequest, mockResponse, nextFunctionAtfer);

    expect(mockRequest.headers['x-correlation-id']).toBe('new-uuid');
    expect(mockResponse.setHeader).toHaveBeenCalledWith('x-correlation-id', 'new-uuid');
    expect(nextFunctionAtfer).toHaveBeenCalled();
  });

  it('should use existing correlation ID if present in headers', () => {
    mockRequest.headers['x-correlation-id'] = 'existing-uuid';

    correlationIdMiddleware(mockRequest, mockResponse, nextFunctionAtfer);

    expect(mockRequest.headers['x-correlation-id']).toBe('existing-uuid');
    expect(mockResponse.setHeader).toHaveBeenCalledWith('x-correlation-id', 'existing-uuid');
    expect(nextFunctionAtfer).toHaveBeenCalled();
    expect(mockedUuidv4).not.toHaveBeenCalled();
  });
});
