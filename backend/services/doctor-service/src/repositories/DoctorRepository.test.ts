import { DoctorRepository } from './DoctorRepository';
import { AppDataSource } from '../config/database';

jest.mock('../config/database', () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

describe('DoctorRepository', () => {
  let doctorRepository: DoctorRepository;
  let mockRepo: any;

  beforeEach(() => {
    mockRepo = {
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepo);
    doctorRepository = new DoctorRepository();
  });

  it('should find doctor by id', async () => {
    mockRepo.findOne.mockResolvedValue({ id: '1' });
    const result = await doctorRepository.findById('1');
    expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    expect(result).toEqual({ id: '1' });
  });

  it('should find doctor by user id', async () => {
    mockRepo.findOne.mockResolvedValue({ userId: 'u1' });
    const result = await doctorRepository.findByUserId('u1');
    expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { userId: 'u1' } });
    expect(result).toEqual({ userId: 'u1' });
  });

  it('should find doctors by specialization', async () => {
    mockRepo.find.mockResolvedValue([]);
    const result = await doctorRepository.findBySpecialization('Cardio');
    expect(mockRepo.find).toHaveBeenCalledWith({ where: { specialization: 'Cardio', isAcceptingPatients: true } });
    expect(result).toEqual([]);
  });

  it('should create doctor', async () => {
    const data = { firstName: 'Sarah' };
    mockRepo.create.mockReturnValue(data);
    mockRepo.save.mockResolvedValue({ ...data, id: '1' });
    const result = await doctorRepository.create(data);
    expect(mockRepo.create).toHaveBeenCalledWith(data);
    expect(mockRepo.save).toHaveBeenCalled();
    expect(result.id).toBe('1');
  });

  it('should update doctor', async () => {
    mockRepo.update.mockResolvedValue({});
    mockRepo.findOne.mockResolvedValue({ id: '1', phone: '123' });
    const result = await doctorRepository.update('1', { phone: '123' });
    expect(mockRepo.update).toHaveBeenCalledWith('1', { phone: '123' });
    expect(result?.phone).toBe('123');
  });

  it('should delete doctor', async () => {
    await doctorRepository.delete('1');
    expect(mockRepo.delete).toHaveBeenCalledWith('1');
  });

  it('should find all doctors', async () => {
    mockRepo.find.mockResolvedValue([]);
    const result = await doctorRepository.findAll();
    expect(mockRepo.find).toHaveBeenCalled();
    expect(result).toEqual([]);
  });
});
