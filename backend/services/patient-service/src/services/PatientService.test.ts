import { PatientService } from './PatientService';
import { PatientRepository } from '../repositories/PatientRepository';

jest.mock('../repositories/PatientRepository');

describe('PatientService', () => {
  let patientService: PatientService;
  let mockPatientRepository: jest.Mocked<PatientRepository>;

  beforeEach(() => {
    jest.clearAllMocks();
    patientService = new PatientService();
    mockPatientRepository = (patientService as any).patientRepository;
  });

  describe('createPatient', () => {
    const createData = {
      userId: 'user-123',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-01',
      phone: '1234567890',
      bloodGroup: 'O+',
    };

    it('should create a patient successfully', async () => {
      mockPatientRepository.findByUserId.mockResolvedValue(null);
      mockPatientRepository.create.mockResolvedValue({
        ...createData,
        id: 'patient-123',
        dateOfBirth: new Date(createData.dateOfBirth),
      } as any);

      const result = await patientService.createPatient(createData);

      expect(mockPatientRepository.findByUserId).toHaveBeenCalledWith('user-123');
      expect(mockPatientRepository.create).toHaveBeenCalled();
      expect(result.id).toBe('patient-123');
    });

    it('should throw error if patient already exists for user', async () => {
      mockPatientRepository.findByUserId.mockResolvedValue({ id: 'existing' } as any);

      await expect(patientService.createPatient(createData)).rejects.toThrow(
        'PATIENT_ALREADY_EXISTS'
      );
    });
  });

  describe('getPatientById', () => {
    it('should return patient if found', async () => {
      const mockPatient = { id: 'patient-123' };
      mockPatientRepository.findById.mockResolvedValue(mockPatient as any);

      const result = await patientService.getPatientById('patient-123');

      expect(result).toBe(mockPatient);
    });

    it('should throw error if patient not found', async () => {
      mockPatientRepository.findById.mockResolvedValue(null);

      await expect(patientService.getPatientById('patient-123')).rejects.toThrow(
        'PATIENT_NOT_FOUND'
      );
    });
  });

  describe('getPatientByUserId', () => {
    it('should return patient if found', async () => {
      const mockPatient = { userId: 'user-123' };
      mockPatientRepository.findByUserId.mockResolvedValue(mockPatient as any);

      const result = await patientService.getPatientByUserId('user-123');

      expect(result).toBe(mockPatient);
    });

    it('should throw error if patient not found', async () => {
      mockPatientRepository.findByUserId.mockResolvedValue(null);

      await expect(patientService.getPatientByUserId('user-123')).rejects.toThrow(
        'PATIENT_NOT_FOUND'
      );
    });
  });

  describe('updatePatient', () => {
    it('should update and return patient', async () => {
      const mockPatient = { id: 'patient-123' };
      mockPatientRepository.findById.mockResolvedValue(mockPatient as any);
      mockPatientRepository.update.mockResolvedValue({ ...mockPatient, firstName: 'New' } as any);

      const result = await patientService.updatePatient('patient-123', { firstName: 'New' });

      expect(result.firstName).toBe('New');
    });

    it('should throw error if patient not found', async () => {
      mockPatientRepository.findById.mockResolvedValue(null);

      await expect(patientService.updatePatient('patient-123', {})).rejects.toThrow(
        'PATIENT_NOT_FOUND'
      );
    });

    it('should throw error if update failed', async () => {
      mockPatientRepository.findById.mockResolvedValue({ id: '1' } as any);
      mockPatientRepository.update.mockResolvedValue(null);

      await expect(patientService.updatePatient('patient-123', {})).rejects.toThrow(
        'UPDATE_FAILED'
      );
    });
  });

  describe('deletePatient', () => {
    it('should delete patient if found', async () => {
      mockPatientRepository.findById.mockResolvedValue({ id: '1' } as any);

      await patientService.deletePatient('patient-123');

      expect(mockPatientRepository.delete).toHaveBeenCalledWith('patient-123');
    });

    it('should throw error if patient not found', async () => {
      mockPatientRepository.findById.mockResolvedValue(null);

      await expect(patientService.deletePatient('patient-123')).rejects.toThrow(
        'PATIENT_NOT_FOUND'
      );
    });
  });

  describe('getAllPatients', () => {
    it('should return all patients', async () => {
      const mockPatients = [{ id: '1' }, { id: '2' }];
      mockPatientRepository.findAll.mockResolvedValue(mockPatients as any);

      const result = await patientService.getAllPatients();

      expect(result).toEqual(mockPatients);
    });
  });
});
