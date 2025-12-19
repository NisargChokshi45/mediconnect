import { UserRepository } from './UserRepository';
import { AppDataSource } from '../config/database';

jest.mock('../config/database', () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

describe('UserRepository', () => {
  let userRepository: UserRepository;
  let mockRepository: any;

  beforeEach(() => {
    mockRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepository);
    userRepository = new UserRepository();
  });

  it('should find by id', async () => {
    mockRepository.findOne.mockResolvedValue({ id: '1' });
    const result = await userRepository.findById('1');
    expect(result?.id).toBe('1');
  });

  it('should find by email', async () => {
    mockRepository.findOne.mockResolvedValue({ email: 'e' });
    const result = await userRepository.findByEmail('e');
    expect(result?.email).toBe('e');
  });

  it('should create user', async () => {
    const data = { email: 'e', passwordHash: 'h', role: 'PATIENT' as any };
    mockRepository.create.mockReturnValue(data);
    mockRepository.save.mockResolvedValue({ ...data, id: '1' });
    const result = await userRepository.create(data);
    expect(result.id).toBe('1');
  });

  it('should update last login', async () => {
    await userRepository.updateLastLogin('1');
    expect(mockRepository.update).toHaveBeenCalledWith(
      '1',
      expect.objectContaining({ lastLoginAt: expect.any(Date) })
    );
  });

  it('should update user', async () => {
    mockRepository.findOne.mockResolvedValue({ id: '1', email: 'new' });
    const result = await userRepository.update('1', { email: 'new' });
    expect(mockRepository.update).toHaveBeenCalledWith('1', { email: 'new' });
    expect(result?.email).toBe('new');
  });

  it('should delete user', async () => {
    await userRepository.delete('1');
    expect(mockRepository.delete).toHaveBeenCalledWith('1');
  });
});
