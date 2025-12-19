import { AuthService } from './AuthService';
import { UserRepository } from '../repositories/UserRepository';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { UserRole } from '../entities/User';

jest.mock('../repositories/UserRepository');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
  let authService: AuthService;
  let mockUserRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    jest.clearAllMocks();
    authService = new AuthService();
    mockUserRepository = (authService as any).userRepository;
  });

  describe('register', () => {
    const registerData = {
      email: 'test@example.com',
      password: 'password123',
      role: UserRole.PATIENT,
    };

    it('should register a new user successfully', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');
      mockUserRepository.create.mockResolvedValue({
        id: 'user-123',
        email: registerData.email,
        role: registerData.role,
      } as any);
      (jwt.sign as jest.Mock).mockReturnValue('mock_token');

      const result = await authService.register(registerData);

      expect(result.accessToken).toBe('mock_token');
      expect(result.user.email).toBe(registerData.email);
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        email: registerData.email,
        passwordHash: 'hashed_password',
        role: registerData.role,
      });
    });

    it('should throw error if user already exists', async () => {
      mockUserRepository.findByEmail.mockResolvedValue({ id: 'existing' } as any);
      await expect(authService.register(registerData)).rejects.toThrow('USER_ALREADY_EXISTS');
    });
  });

  describe('login', () => {
    const loginData = {
      email: 'test@example.com',
      password: 'password123',
      role: UserRole.PATIENT,
    };

    it('should login successfully', async () => {
      const mockUser = {
        id: 'user-123',
        email: loginData.email,
        role: loginData.role,
        passwordHash: 'hashed_password',
        isActive: true,
      };
      mockUserRepository.findByEmail.mockResolvedValue(mockUser as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('mock_token');

      const result = await authService.login(loginData);

      expect(result.accessToken).toBe('mock_token');
      expect(mockUserRepository.updateLastLogin).toHaveBeenCalledWith('user-123');
    });

    it('should throw error if user not found', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      await expect(authService.login(loginData)).rejects.toThrow('INVALID_CREDENTIALS');
    });

    it('should throw error if role mismatch', async () => {
      mockUserRepository.findByEmail.mockResolvedValue({ role: UserRole.DOCTOR } as any);
      await expect(authService.login(loginData)).rejects.toThrow('INVALID_CREDENTIALS');
    });

    it('should throw error if password invalid', async () => {
      mockUserRepository.findByEmail.mockResolvedValue({ role: UserRole.PATIENT, passwordHash: 'h' } as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      await expect(authService.login(loginData)).rejects.toThrow('INVALID_CREDENTIALS');
    });

    it('should throw error if user inactive', async () => {
      mockUserRepository.findByEmail.mockResolvedValue({ role: UserRole.PATIENT, passwordHash: 'h', isActive: false } as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      await expect(authService.login(loginData)).rejects.toThrow('USER_INACTIVE');
    });
  });

  describe('verifyToken', () => {
    it('should verify token successfully', async () => {
      const decoded = { userId: 'u1', email: 'e', role: UserRole.PATIENT };
      (jwt.verify as jest.Mock).mockReturnValue(decoded);
      mockUserRepository.findById.mockResolvedValue({ isActive: true } as any);

      const result = await authService.verifyToken('token');

      expect(result).toEqual(decoded);
    });

    it('should throw error if token invalid', async () => {
      (jwt.verify as jest.Mock).mockImplementation(() => { throw new Error(); });
      await expect(authService.verifyToken('token')).rejects.toThrow('INVALID_TOKEN');
    });

    it('should throw error if user not found or inactive', async () => {
      (jwt.verify as jest.Mock).mockReturnValue({ userId: 'u1' });
      mockUserRepository.findById.mockResolvedValue(null);
      await expect(authService.verifyToken('token')).rejects.toThrow('INVALID_TOKEN');
      
      mockUserRepository.findById.mockResolvedValue({ isActive: false } as any);
      await expect(authService.verifyToken('token')).rejects.toThrow('INVALID_TOKEN');
    });
  });
});
