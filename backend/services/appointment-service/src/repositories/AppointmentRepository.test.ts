import { AppointmentRepository } from './AppointmentRepository';
import { AppDataSource } from '../config/database';
import { AppointmentStatus } from '../entities/Appointment';

jest.mock('../config/database', () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

describe('AppointmentRepository', () => {
  let appointmentRepository: AppointmentRepository;
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
    appointmentRepository = new AppointmentRepository();
  });

  it('should find by id', async () => {
    mockRepo.findOne.mockResolvedValue({ id: '1' });
    const result = await appointmentRepository.findById('1');
    expect(result).toEqual({ id: '1' });
  });

  it('should find by patient id', async () => {
    mockRepo.find.mockResolvedValue([]);
    await appointmentRepository.findByPatientId('p1');
    expect(mockRepo.find).toHaveBeenCalledWith(
      expect.objectContaining({ where: { patientId: 'p1' } })
    );
  });

  it('should find by doctor id', async () => {
    mockRepo.find.mockResolvedValue([]);
    await appointmentRepository.findByDoctorId('d1');
    expect(mockRepo.find).toHaveBeenCalledWith(
      expect.objectContaining({ where: { doctorId: 'd1' } })
    );
  });

  it('should find upcoming', async () => {
    mockRepo.find.mockResolvedValue([]);
    await appointmentRepository.findUpcoming('p1');
    expect(mockRepo.find).toHaveBeenCalled();
  });

  it('should create appointment', async () => {
    mockRepo.create.mockReturnValue({ id: '1' });
    mockRepo.save.mockResolvedValue({ id: '1' });
    const result = await appointmentRepository.create({});
    expect(result.id).toBe('1');
  });

  it('should update appointment', async () => {
    mockRepo.update.mockResolvedValue({});
    mockRepo.findOne.mockResolvedValue({ id: '1' });
    const result = await appointmentRepository.update('1', {});
    expect(result).toEqual({ id: '1' });
  });

  it('should delete appointment', async () => {
    await appointmentRepository.delete('1');
    expect(mockRepo.delete).toHaveBeenCalledWith('1');
  });
});
