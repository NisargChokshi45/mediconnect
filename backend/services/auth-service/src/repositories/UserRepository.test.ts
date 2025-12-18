import { UserRepository } from './UserRepository';
import { AppDataSource } from '../config/database';
import { UserRole } from '../entities/User';

jest.mock('../config/database', () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

describe('UserRepository', () => {
  let userRepository: UserRepository;
  let mockRepo: any;

  beforeEach(() => {
    mockRepo = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepo);
    userRepository = new UserRepository();
  });

  it('should find user by id', async () => {
    const mockUser = { id: 'uuid' };
    mockRepo.findOne.mockResolvedValue(mockUser);
    const result = await userRepository.findById('uuid');
    expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { id: 'uuid' } });
    expect(result).toBe(mockUser);
  });

  it('should find user by email', async () => {
    const mockUser = { email: 'test@test.com' };
    mockRepo.findOne.mockResolvedValue(mockUser);
    const result = await userRepository.findByEmail('test@test.com');
    expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { email: 'test@test.com' } });
    expect(result).toBe(mockUser);
  });

  it('should create user', async () => {
    const userData = { email: 'test@test.com', passwordHash: 'hash', role: UserRole.PATIENT };
    const mockUser = { ...userData, id: 'uuid' };
    mockRepo.create.mockReturnValue(mockUser);
    mockRepo.save.mockResolvedValue(mockUser);

    const result = await userRepository.create(userData);

    expect(mockRepo.create).toHaveBeenCalledWith(userData);
    expect(mockRepo.save).toHaveBeenCalledWith(mockUser);
    expect(result).toBe(mockUser);
  });

  it('should update last login', async () => {
    await userRepository.updateLastLogin('uuid');
    expect(mockRepo.update).toHaveBeenCalledWith('uuid', { lastLoginAt: expect.any(Date) });
  });

  it('should update user and return it', async () => {
    const updateData = { email: 'new@test.com' };
    const mockUser = { id: 'uuid', ...updateData };
    mockRepo.update.mockResolvedValue({});
    mockRepo.findOne.mockResolvedValue(mockUser);

    const result = await userRepository.update('uuid', updateData);

    expect(mockRepo.update).toHaveBeenCalledWith('uuid', updateData);
    expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { id: 'uuid' } });
    expect(result).toBe(mockUser);
  });

  it('should delete user', async () => {
    await userRepository.delete('uuid');
    expect(mockRepo.delete).toHaveBeenCalledWith('uuid');
  });
});
