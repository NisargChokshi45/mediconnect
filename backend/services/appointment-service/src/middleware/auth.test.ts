import { authMiddleware, requireRole } from './auth';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Auth Middleware', () => {
  let mockRequest: any;
  let mockResponse: any;
  let nextFunction: any;

  beforeEach(() => {
    mockRequest = { headers: {} };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
    jest.clearAllMocks();
  });

  describe('authMiddleware', () => {
    it('should return 401 if missing token', async () => {
      await authMiddleware(mockRequest, mockResponse, nextFunction);
      expect(mockResponse.status).toHaveBeenCalledWith(401);
    });

    it('should call next if valid token', async () => {
      mockRequest.headers.authorization = 'Bearer token';
      mockedAxios.post.mockResolvedValue({ data: { success: true, data: { userId: '1', role: 'PATIENT' } } });
      await authMiddleware(mockRequest, mockResponse, nextFunction);
      expect(nextFunction).toHaveBeenCalled();
      expect(mockRequest.user).toBeDefined();
    });

    it('should return 401 if invalid token', async () => {
      mockRequest.headers.authorization = 'Bearer token';
      mockedAxios.post.mockResolvedValue({ data: { success: false } });
      await authMiddleware(mockRequest, mockResponse, nextFunction);
      expect(mockResponse.status).toHaveBeenCalledWith(401);
    });

    it('should return 401 if axios fails', async () => {
      mockRequest.headers.authorization = 'Bearer token';
      mockedAxios.post.mockRejectedValue(new Error());
      await authMiddleware(mockRequest, mockResponse, nextFunction);
      expect(mockResponse.status).toHaveBeenCalledWith(401);
    });
  });

  describe('requireRole', () => {
    it('should call next if role matches', () => {
      mockRequest.user = { role: 'PATIENT' };
      requireRole(['PATIENT'])(mockRequest, mockResponse, nextFunction);
      expect(nextFunction).toHaveBeenCalled();
    });

    it('should return 403 if role mismatch', () => {
      mockRequest.user = { role: 'DOCTOR' };
      requireRole(['PATIENT'])(mockRequest, mockResponse, nextFunction);
      expect(mockResponse.status).toHaveBeenCalledWith(403);
    });
  });
});
