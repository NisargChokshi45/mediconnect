import { PatientRepository } from './PatientRepository';
import { AppDataSource } from '../config/database';

jest.mock('../config/database', () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

describe('PatientRepository', () => {
  let patientRepository: PatientRepository;
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
    patientRepository = new PatientRepository();
  });

  it('should find patient by id', async () => {
    const mockPatient = { id: 'uuid' };
    mockRepo.findOne.mockResolvedValue(mockPatient);
    const result = await patientRepository.findById('uuid');
    expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { id: 'uuid' } });
    expect(result).toBe(mockPatient);
  });

  it('should find patient by user id', async () => {
    const mockPatient = { userId: 'uuid' };
    mockRepo.findOne.mockResolvedValue(mockPatient);
    const result = await patientRepository.findByUserId('uuid');
    expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { userId: 'uuid' } });
    expect(result).toBe(mockPatient);
  });

  it('should create patient', async () => {
    const data = { firstName: 'John' };
    const mockPatient = { ...data, id: 'uuid' };
    mockRepo.create.mockReturnValue(mockPatient);
    mockRepo.save.mockResolvedValue(mockPatient);

    const result = await patientRepository.create(data);

    expect(mockRepo.create).toHaveBeenCalledWith(data);
    expect(mockRepo.save).toHaveBeenCalledWith(mockPatient);
    expect(result).toBe(mockPatient);
  });

  it('should update patient and return it', async () => {
    const updateData = { firstName: 'New' };
    const mockPatient = { id: 'uuid', ...updateData };
    mockRepo.update.mockResolvedValue({});
    mockRepo.findOne.mockResolvedValue(mockPatient);
    // Fix: the findById implementation calls findOne.
    // In our test, mocked findById is not used because we are testing the real Repository class.
    // So we just mock findOne again or let the first mock handle it.

    mockRepo.findOne.mockResolvedValue(mockPatient);

    const result = await patientRepository.update('uuid', updateData);

    expect(mockRepo.update).toHaveBeenCalledWith('uuid', updateData);
    expect(result).toBe(mockPatient);
  });

  it('should delete patient', async () => {
    await patientRepository.delete('uuid');
    expect(mockRepo.delete).toHaveBeenCalledWith('uuid');
  });

  it('should find all patients', async () => {
    const mockPatients = [{ id: '1' }];
    mockRepo.find.mockResolvedValue(mockPatients);
    const result = await patientRepository.findAll();
    expect(mockRepo.find).toHaveBeenCalled();
    expect(result).toBe(mockPatients);
  });
});
