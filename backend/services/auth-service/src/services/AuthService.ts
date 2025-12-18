import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/UserRepository';
import { UserRole } from '../entities/User';
import { config } from '../config';
import { LoginDto, RegisterDto, TokenResponseDto } from '../types/dtos';

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(data: RegisterDto): Promise<TokenResponseDto> {
    // Check if user exists
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error('USER_ALREADY_EXISTS');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, 10);

    // Create user
    const user = await this.userRepository.create({
      email: data.email,
      passwordHash,
      role: data.role,
    });

    // Generate JWT
    const token = this.generateToken(user.id, user.email, user.role);

    return {
      accessToken: token,
      expiresIn: config.jwt.expiresIn,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  async login(data: LoginDto): Promise<TokenResponseDto> {
    // Find user
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new Error('INVALID_CREDENTIALS');
    }

    // Verify role matches
    if (user.role !== data.role) {
      throw new Error('INVALID_CREDENTIALS');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(data.password, user.passwordHash);
    if (!isValidPassword) {
      throw new Error('INVALID_CREDENTIALS');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new Error('USER_INACTIVE');
    }

    // Update last login
    await this.userRepository.updateLastLogin(user.id);

    // Generate JWT
    const token = this.generateToken(user.id, user.email, user.role);

    return {
      accessToken: token,
      expiresIn: config.jwt.expiresIn,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  async verifyToken(token: string): Promise<{ userId: string; email: string; role: UserRole }> {
    try {
      const decoded = jwt.verify(token, config.jwt.secret) as {
        userId: string;
        email: string;
        role: UserRole;
      };

      // Verify user still exists and is active
      const user = await this.userRepository.findById(decoded.userId);
      if (!user || !user.isActive) {
        throw new Error('INVALID_TOKEN');
      }

      return decoded;
    } catch (error) {
      throw new Error('INVALID_TOKEN');
    }
  }

  private generateToken(userId: string, email: string, role: UserRole): string {
    return jwt.sign({ userId, email, role }, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });
  }
}
