import request from 'supertest';
import express from 'express';
import router from './auth';
import { AuthService } from '../services/AuthService';
import { errorHandler } from '../middleware/errorHandler';

jest.mock('../services/AuthService');
jest.mock('../utils/logger', () => ({
  createLogger: () => ({
    info: jest.fn(),
    error: jest.fn(),
  }),
}));

const mockAuthService = new AuthService() as jest.Mocked<AuthService>;

const app = express();
app.use(express.json());
app.use('/auth', router);
app.use(errorHandler);

describe('Auth Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /auth/register', () => {
    it('should register a user and return 201', async () => {
      const mockResult = { user: { id: '1' }, accessToken: 'token' };
      (AuthService.prototype.register as jest.Mock).mockResolvedValue(mockResult);

      const response = await request(app)
        .post('/auth/register')
        .send({ email: 'test@test.com', password: 'password123', role: 'PATIENT' });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockResult);
    });

    it('should return error if service throws', async () => {
      (AuthService.prototype.register as jest.Mock).mockRejectedValue(
        new Error('USER_ALREADY_EXISTS')
      );

      const response = await request(app)
        .post('/auth/register')
        .send({ email: 'test@test.com', password: 'password123', role: 'PATIENT' });

      expect(response.status).toBe(409);
    });
  });

  describe('POST /auth/login', () => {
    it('should login a user and return 200', async () => {
      const mockResult = { user: { id: '1' }, accessToken: 'token' };
      (AuthService.prototype.login as jest.Mock).mockResolvedValue(mockResult);

      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'test@test.com', password: 'password123', role: 'PATIENT' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockResult);
    });

    it('should return error if login fails', async () => {
      (AuthService.prototype.login as jest.Mock).mockRejectedValue(
        new Error('INVALID_CREDENTIALS')
      );

      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'test@test.com', password: 'password123', role: 'PATIENT' });

      expect(response.status).toBe(401);
    });
  });

  describe('POST /auth/verify', () => {
    it('should verify a token and return 200', async () => {
      const mockDecoded = { userId: '1' };
      (AuthService.prototype.verifyToken as jest.Mock).mockResolvedValue(mockDecoded);

      const response = await request(app)
        .post('/auth/verify')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockDecoded);
    });

    it('should return 401 if no token provided', async () => {
      const response = await request(app).post('/auth/verify');
      expect(response.status).toBe(401);
    });

    it('should return error if verifyToken throws', async () => {
      (AuthService.prototype.verifyToken as jest.Mock).mockRejectedValue(
        new Error('INVALID_TOKEN')
      );

      const response = await request(app)
        .post('/auth/verify')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
    });
  });
});
