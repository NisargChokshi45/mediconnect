import { AppointmentService } from './AppointmentService';
import { AppointmentRepository } from '../repositories/AppointmentRepository';
import { InsuranceService } from './InsuranceService';
import { AppointmentStatus } from '../entities/Appointment';
import axios from 'axios';

jest.mock('../repositories/AppointmentRepository');
jest.mock('./InsuranceService');
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('AppointmentService', () => {
  let appointmentService: AppointmentService;
  let mockAppointmentRepository: jest.Mocked<AppointmentRepository>;
  let mockInsuranceService: jest.Mocked<InsuranceService>;

  beforeEach(() => {
    jest.clearAllMocks();
    appointmentService = new AppointmentService();
    mockAppointmentRepository = (appointmentService as any).appointmentRepository;
    mockInsuranceService = (appointmentService as any).insuranceService;
  });

  describe('createAppointment', () => {
    const createData = {
      patientId: 'p1',
      doctorId: 'd1',
      scheduledAt: '2025-01-01T10:00:00Z',
      reason: 'Checkup',
    };

    it('should create an appointment successfully', async () => {
      mockedAxios.get.mockResolvedValue({
        data: { success: true, data: { insurancePolicyNumber: 'POL123' } },
      });
      mockAppointmentRepository.create.mockResolvedValue({
        id: 'a1',
        ...createData,
        scheduledAt: new Date(createData.scheduledAt),
      } as any);
      mockInsuranceService.verifyEligibility.mockResolvedValue({
        verified: true,
        eligibilityStatus: 'ACTIVE',
      });

      const result = await appointmentService.createAppointment(createData as any);

      expect(result.id).toBe('a1');

      // Wait for async background task verifyInsuranceAsync
      for (let i = 0; i < 5; i++) {
        await new Promise((resolve) => setTimeout(resolve, 50));
      }

      expect(mockInsuranceService.verifyEligibility).toHaveBeenCalled();
    });

    it('should throw PATIENT_NOT_FOUND if patient verify fails', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Patient missing'));
      await expect(appointmentService.createAppointment(createData as any)).rejects.toThrow(
        'PATIENT_NOT_FOUND'
      );
    });

    it('should throw DOCTOR_NOT_FOUND if doctor verify fails', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: { ok: true } }); // Patient ok
      mockedAxios.get.mockRejectedValueOnce(new Error('Doctor missing')); // Doctor fail
      await expect(appointmentService.createAppointment(createData as any)).rejects.toThrow(
        'DOCTOR_NOT_FOUND'
      );
    });
  });

  describe('verifyInsuranceAsync', () => {
    it('should update appointment if insurance verified', async () => {
      mockedAxios.get.mockResolvedValue({ data: { data: { insurancePolicyNumber: 'POL123' } } });
      mockInsuranceService.verifyEligibility.mockResolvedValue({
        verified: true,
        eligibilityStatus: 'ACTIVE',
      });

      await (appointmentService as any).verifyInsuranceAsync('a1', 'p1');

      expect(mockedAxios.get).toHaveBeenCalled();
      expect(mockInsuranceService.verifyEligibility).toHaveBeenCalledWith('p1', 'POL123');
      expect(mockAppointmentRepository.update).toHaveBeenCalledWith('a1', {
        insuranceVerified: true,
      });
    });

    it('should not update if no policy number', async () => {
      mockedAxios.get.mockResolvedValue({ data: { data: {} } });
      await (appointmentService as any).verifyInsuranceAsync('a1', 'p1');
      expect(mockAppointmentRepository.update).not.toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      mockedAxios.get.mockRejectedValue(new Error('fail'));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      await (appointmentService as any).verifyInsuranceAsync('a1', 'p1');
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('getAppointmentById', () => {
    it('should return appointment if found', async () => {
      mockAppointmentRepository.findById.mockResolvedValue({ id: 'a1' } as any);
      const result = await appointmentService.getAppointmentById('a1');
      expect(result.id).toBe('a1');
    });

    it('should throw if not found', async () => {
      mockAppointmentRepository.findById.mockResolvedValue(null);
      await expect(appointmentService.getAppointmentById('a1')).rejects.toThrow(
        'APPOINTMENT_NOT_FOUND'
      );
    });
  });

  describe('updateAppointmentStatus', () => {
    it('should update status', async () => {
      mockAppointmentRepository.findById.mockResolvedValue({ id: 'a1' } as any);
      mockAppointmentRepository.update.mockResolvedValue({
        id: 'a1',
        status: AppointmentStatus.COMPLETED,
      } as any);
      const result = await appointmentService.updateAppointmentStatus('a1', {
        status: AppointmentStatus.COMPLETED,
      });
      expect(result.status).toBe(AppointmentStatus.COMPLETED);
    });

    it('should handle cancellation', async () => {
      mockAppointmentRepository.findById.mockResolvedValue({ id: 'a1' } as any);
      mockAppointmentRepository.update.mockResolvedValue({
        id: 'a1',
        status: AppointmentStatus.CANCELLED,
      } as any);
      await appointmentService.updateAppointmentStatus('a1', {
        status: AppointmentStatus.CANCELLED,
        cancellationReason: 'Ill',
      });
      expect(mockAppointmentRepository.update).toHaveBeenCalledWith(
        'a1',
        expect.objectContaining({ status: AppointmentStatus.CANCELLED, cancellationReason: 'Ill' })
      );
    });

    it('should throw UPDATE_FAILED if update null', async () => {
      mockAppointmentRepository.findById.mockResolvedValue({ id: 'a1' } as any);
      mockAppointmentRepository.update.mockResolvedValue(null);
      await expect(
        appointmentService.updateAppointmentStatus('a1', { status: AppointmentStatus.COMPLETED })
      ).rejects.toThrow('UPDATE_FAILED');
    });

    it('should throw APPOINTMENT_NOT_FOUND if appointment not exists', async () => {
      mockAppointmentRepository.findById.mockResolvedValue(null);
      await expect(
        appointmentService.updateAppointmentStatus('a1', { status: AppointmentStatus.COMPLETED })
      ).rejects.toThrow('APPOINTMENT_NOT_FOUND');
    });
  });

  describe('deleteAppointment', () => {
    it('should delete', async () => {
      mockAppointmentRepository.findById.mockResolvedValue({ id: '1' } as any);
      await appointmentService.deleteAppointment('1');
      expect(mockAppointmentRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw APPOINTMENT_NOT_FOUND if appointment not exists', async () => {
      mockAppointmentRepository.findById.mockResolvedValue(null);
      await expect(appointmentService.deleteAppointment('1')).rejects.toThrow(
        'APPOINTMENT_NOT_FOUND'
      );
    });
  });

  describe('getInsuranceCircuitBreakerStats', () => {
    it('should return stats', () => {
      mockInsuranceService.getCircuitBreakerStats.mockReturnValue({
        state: 'CLOSED',
        stats: {},
      } as any);
      const result = appointmentService.getInsuranceCircuitBreakerStats();
      expect(result.state).toBe('CLOSED');
    });
  });

  describe('getPatientAppointments, getDoctorAppointments, getUpcomingAppointments', () => {
    it('should call repository methods', async () => {
      mockAppointmentRepository.findByPatientId.mockResolvedValue([]);
      await appointmentService.getPatientAppointments('p1');
      expect(mockAppointmentRepository.findByPatientId).toHaveBeenCalledWith('p1');

      mockAppointmentRepository.findByDoctorId.mockResolvedValue([]);
      await appointmentService.getDoctorAppointments('d1');
      expect(mockAppointmentRepository.findByDoctorId).toHaveBeenCalledWith('d1');

      mockAppointmentRepository.findUpcoming.mockResolvedValue([]);
      await appointmentService.getUpcomingAppointments('p1');
      expect(mockAppointmentRepository.findUpcoming).toHaveBeenCalledWith('p1');
    });
  });
});
