import { AuthService } from './AuthService';
import { UserRepository } from '../repositories/UserRepository';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { UserRole } from '../entities/User';
import { config } from '../config';

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
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      const mockUser = {
        id: 'user-id',
        email: registerData.email,
        role: registerData.role,
        passwordHash: 'hashedPassword',
      };
      mockUserRepository.create.mockResolvedValue(mockUser as any);
      (jwt.sign as jest.Mock).mockReturnValue('mock-token');

      const result = await authService.register(registerData);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(registerData.email);
      expect(bcrypt.hash).toHaveBeenCalledWith(registerData.password, 10);
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        email: registerData.email,
        passwordHash: 'hashedPassword',
        role: registerData.role,
      });
      expect(result).toEqual({
        accessToken: 'mock-token',
        expiresIn: config.jwt.expiresIn,
        user: {
          id: 'user-id',
          email: registerData.email,
          role: registerData.role,
        },
      });
    });

    it('should throw error if user already exists', async () => {
      mockUserRepository.findByEmail.mockResolvedValue({ id: 'existing-id' } as any);

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
        id: 'user-id',
        email: loginData.email,
        role: loginData.role,
        passwordHash: 'hashedPassword',
        isActive: true,
      };
      mockUserRepository.findByEmail.mockResolvedValue(mockUser as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('mock-token');

      const result = await authService.login(loginData);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(loginData.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(loginData.password, 'hashedPassword');
      expect(mockUserRepository.updateLastLogin).toHaveBeenCalledWith('user-id');
      expect(result).toEqual({
        accessToken: 'mock-token',
        expiresIn: config.jwt.expiresIn,
        user: {
          id: 'user-id',
          email: loginData.email,
          role: loginData.role,
        },
      });
    });

    it('should throw INVALID_CREDENTIALS if user not found', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(authService.login(loginData)).rejects.toThrow('INVALID_CREDENTIALS');
    });

    it('should throw INVALID_CREDENTIALS if role does not match', async () => {
      mockUserRepository.findByEmail.mockResolvedValue({ role: UserRole.DOCTOR } as any);

      await expect(authService.login(loginData)).rejects.toThrow('INVALID_CREDENTIALS');
    });

    it('should throw INVALID_CREDENTIALS if password does not match', async () => {
      mockUserRepository.findByEmail.mockResolvedValue({ role: UserRole.PATIENT, passwordHash: 'hash' } as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.login(loginData)).rejects.toThrow('INVALID_CREDENTIALS');
    });

    it('should throw USER_INACTIVE if user is not active', async () => {
      mockUserRepository.findByEmail.mockResolvedValue({
        role: UserRole.PATIENT,
        passwordHash: 'hash',
        isActive: false,
      } as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await expect(authService.login(loginData)).rejects.toThrow('USER_INACTIVE');
    });
  });

  describe('verifyToken', () => {
    it('should verify token successfully', async () => {
      const decoded = { userId: 'user-id', email: 'test@example.com', role: UserRole.PATIENT };
      (jwt.verify as jest.Mock).mockReturnValue(decoded);
      mockUserRepository.findById.mockResolvedValue({ id: 'user-id', isActive: true } as any);

      const result = await authService.verifyToken('mock-token');

      expect(jwt.verify).toHaveBeenCalledWith('mock-token', config.jwt.secret);
      expect(mockUserRepository.findById).toHaveBeenCalledWith('user-id');
      expect(result).toEqual(decoded);
    });

    it('should throw INVALID_TOKEN if token is invalid', async () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('jwt error');
      });

      await expect(authService.verifyToken('invalid-token')).rejects.toThrow('INVALID_TOKEN');
    });

    it('should throw INVALID_TOKEN if user not found', async () => {
      (jwt.verify as jest.Mock).mockReturnValue({ userId: 'user-id' });
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(authService.verifyToken('mock-token')).rejects.toThrow('INVALID_TOKEN');
    });

    it('should throw INVALID_TOKEN if user is inactive', async () => {
      (jwt.verify as jest.Mock).mockReturnValue({ userId: 'user-id' });
      mockUserRepository.findById.mockResolvedValue({ isActive: false } as any);

      await expect(authService.verifyToken('mock-token')).rejects.toThrow('INVALID_TOKEN');
    });
  });
});
