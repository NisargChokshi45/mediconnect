import { authMiddleware, requireRole } from './auth';
import axios from 'axios';
import { config } from '../config';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Auth Middleware', () => {
  let mockRequest: any;
  let mockResponse: any;
  let nextFunction: any;

  beforeEach(() => {
    mockRequest = {
      headers: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
    jest.clearAllMocks();
  });

  describe('authMiddleware', () => {
    it('should return 401 if no token is provided', async () => {
      await authMiddleware(mockRequest, mockResponse, nextFunction);
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.objectContaining({ code: 'MISSING_TOKEN' }),
        })
      );
    });

    it('should call next() if token is valid', async () => {
      mockRequest.headers.authorization = 'Bearer valid-token';
      mockedAxios.post.mockResolvedValue({
        data: {
          success: true,
          data: { userId: '1', role: 'DOCTOR' },
        },
      });

      await authMiddleware(mockRequest, mockResponse, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
      expect(mockRequest.user).toEqual({ userId: '1', role: 'DOCTOR' });
    });

    it('should return 401 if auth service returns failure', async () => {
      mockRequest.headers.authorization = 'Bearer invalid-token';
      mockedAxios.post.mockResolvedValue({
        data: { success: false },
      });

      await authMiddleware(mockRequest, mockResponse, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
    });

    it('should return 401 if auth service request fails', async () => {
      mockRequest.headers.authorization = 'Bearer token';
      mockedAxios.post.mockRejectedValue(new Error('Network error'));

      await authMiddleware(mockRequest, mockResponse, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
    });
  });

  describe('requireRole', () => {
    it('should call next() if user has required role', () => {
      mockRequest.user = { role: 'DOCTOR' };
      const middleware = requireRole(['DOCTOR']);

      middleware(mockRequest, mockResponse, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
    });

    it('should return 403 if user is missing', () => {
      const middleware = requireRole(['DOCTOR']);

      middleware(mockRequest, mockResponse, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
    });

    it('should return 403 if user has wrong role', () => {
      mockRequest.user = { role: 'PATIENT' };
      const middleware = requireRole(['DOCTOR']);

      middleware(mockRequest, mockResponse, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
    });
  });
});
