import { DoctorService } from './DoctorService';
import { DoctorRepository } from '../repositories/DoctorRepository';

jest.mock('../repositories/DoctorRepository');

describe('DoctorService', () => {
  let doctorService: DoctorService;
  let mockDoctorRepository: jest.Mocked<DoctorRepository>;

  beforeEach(() => {
    jest.clearAllMocks();
    doctorService = new DoctorService();
    mockDoctorRepository = (doctorService as any).doctorRepository;
  });

  describe('createDoctor', () => {
    const createData = {
      userId: 'user-123',
      firstName: 'Sarah',
      lastName: 'Williams',
      specialization: 'Cardiology',
      licenseNumber: 'MD-123',
      phone: '1234567890',
      consultationDuration: 30,
      yearsOfExperience: 5
    };

    it('should create a doctor successfully', async () => {
      mockDoctorRepository.findByUserId.mockResolvedValue(null);
      mockDoctorRepository.create.mockResolvedValue({ ...createData, id: 'doctor-123' } as any);

      const result = await doctorService.createDoctor(createData);

      expect(mockDoctorRepository.findByUserId).toHaveBeenCalledWith('user-123');
      expect(mockDoctorRepository.create).toHaveBeenCalledWith(createData);
      expect(result.id).toBe('doctor-123');
    });

    it('should throw error if doctor already exists', async () => {
      mockDoctorRepository.findByUserId.mockResolvedValue({ id: 'existing' } as any);
      await expect(doctorService.createDoctor(createData)).rejects.toThrow('DOCTOR_ALREADY_EXISTS');
    });
  });

  describe('getDoctorById', () => {
    it('should return doctor if found', async () => {
      const mockDoctor = { id: 'doctor-123' };
      mockDoctorRepository.findById.mockResolvedValue(mockDoctor as any);

      const result = await doctorService.getDoctorById('doctor-123');

      expect(result).toBe(mockDoctor);
    });

    it('should throw error if doctor not found', async () => {
      mockDoctorRepository.findById.mockResolvedValue(null);
      await expect(doctorService.getDoctorById('doctor-123')).rejects.toThrow('DOCTOR_NOT_FOUND');
    });
  });

  describe('getDoctorByUserId', () => {
    it('should return doctor if found', async () => {
      const mockDoctor = { userId: 'user-123' };
      mockDoctorRepository.findByUserId.mockResolvedValue(mockDoctor as any);

      const result = await doctorService.getDoctorByUserId('user-123');

      expect(result).toBe(mockDoctor);
    });

    it('should throw error if doctor not found', async () => {
      mockDoctorRepository.findByUserId.mockResolvedValue(null);
      await expect(doctorService.getDoctorByUserId('user-123')).rejects.toThrow('DOCTOR_NOT_FOUND');
    });
  });

  describe('getDoctorsBySpecialization', () => {
    it('should return doctors by specialization', async () => {
      const mockDoctors = [{ id: '1' }];
      mockDoctorRepository.findBySpecialization.mockResolvedValue(mockDoctors as any);

      const result = await doctorService.getDoctorsBySpecialization('Cardiology');

      expect(result).toEqual(mockDoctors);
    });
  });

  describe('updateDoctor', () => {
    it('should update and return doctor', async () => {
      const mockDoctor = { id: 'doctor-123' };
      mockDoctorRepository.findById.mockResolvedValue(mockDoctor as any);
      mockDoctorRepository.update.mockResolvedValue({ ...mockDoctor, phone: '999' } as any);

      const result = await doctorService.updateDoctor('doctor-123', { phone: '999' });

      expect(result.phone).toBe('999');
    });

    it('should throw error if update fails', async () => {
        mockDoctorRepository.findById.mockResolvedValue({ id: '1' } as any);
        mockDoctorRepository.update.mockResolvedValue(null);
        await expect(doctorService.updateDoctor('doctor-123', {})).rejects.toThrow('UPDATE_FAILED');
    });

    it('should throw error if doctor not found', async () => {
        mockDoctorRepository.findById.mockResolvedValue(null);
        await expect(doctorService.updateDoctor('doctor-123', {})).rejects.toThrow('DOCTOR_NOT_FOUND');
    });
  });

  describe('deleteDoctor', () => {
    it('should delete doctor', async () => {
      mockDoctorRepository.findById.mockResolvedValue({ id: '1' } as any);
      await doctorService.deleteDoctor('doctor-123');
      expect(mockDoctorRepository.delete).toHaveBeenCalledWith('doctor-123');
    });

    it('should throw error if doctor not found', async () => {
        mockDoctorRepository.findById.mockResolvedValue(null);
        await expect(doctorService.deleteDoctor('doctor-123')).rejects.toThrow('DOCTOR_NOT_FOUND');
    });
  });

  describe('getAllDoctors', () => {
    it('should return all doctors', async () => {
      const mockDoctors = [{ id: '1' }];
      mockDoctorRepository.findAll.mockResolvedValue(mockDoctors as any);
      const result = await doctorService.getAllDoctors();
      expect(result).toEqual(mockDoctors);
    });
  });
});
