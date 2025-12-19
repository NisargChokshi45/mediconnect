/* istanbul ignore file */
import { AppointmentRepository } from '../repositories/AppointmentRepository';
import { InsuranceService } from './InsuranceService';
import { CreateAppointmentDto, UpdateAppointmentStatusDto } from '../types/dtos';
import { Appointment, AppointmentStatus } from '../entities/Appointment';
import axios from 'axios';
import { config } from '../config';
export class AppointmentService {
  private appointmentRepository: AppointmentRepository;
  private insuranceService: InsuranceService;
  constructor() {
    this.appointmentRepository = new AppointmentRepository();
    this.insuranceService = new InsuranceService();
  }
  async createAppointment(data: CreateAppointmentDto): Promise<Appointment> {
    const patientUrl = `${config.patientService.url}/api/patients/${data.patientId}`;
    try {
      await axios.get(patientUrl);
    } catch (error) {
      throw new Error('PATIENT_NOT_FOUND');
    }
    const doctorUrl = `${config.doctorService.url}/api/doctors/${data.doctorId}`;
    try {
      await axios.get(doctorUrl);
    } catch (error) {
      throw new Error('DOCTOR_NOT_FOUND');
    }
    const appointmentData = {
      ...data,
      scheduledAt: new Date(data.scheduledAt),
      status: AppointmentStatus.SCHEDULED,
    };
    const appointment = await this.appointmentRepository.create(appointmentData);
    this.verifyInsuranceAsync(appointment.id, data.patientId);
    return appointment;
  }
  private async verifyInsuranceAsync(appointmentId: string, patientId: string) {
    try {
      const patientResponse = await axios.get(`${config.patientService.url}/api/patients/${patientId}`);
      const patient = patientResponse.data.data;
      if (patient.insurancePolicyNumber) {
        const result = await this.insuranceService.verifyEligibility(
          patientId,
          patient.insurancePolicyNumber
        );
        await this.appointmentRepository.update(appointmentId, {
          insuranceVerified: result.verified,
        });
      }
    } catch (error) {
      console.error('Insurance verification failed:', error);
    }
  }
  async getAppointmentById(id: string): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findById(id);
    if (!appointment) {
      throw new Error('APPOINTMENT_NOT_FOUND');
    }
    return appointment;
  }
  async getPatientAppointments(patientId: string): Promise<Appointment[]> {
    return this.appointmentRepository.findByPatientId(patientId);
  }
  async getDoctorAppointments(doctorId: string): Promise<Appointment[]> {
    return this.appointmentRepository.findByDoctorId(doctorId);
  }
  async getUpcomingAppointments(patientId: string): Promise<Appointment[]> {
    return this.appointmentRepository.findUpcoming(patientId);
  }
  async updateAppointmentStatus(id: string, data: UpdateAppointmentStatusDto): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findById(id);
    if (!appointment) {
      throw new Error('APPOINTMENT_NOT_FOUND');
    }
    const updateData: Partial<Appointment> = {
      status: data.status,
    };
    if (data.status === AppointmentStatus.CANCELLED) {
      updateData.cancellationReason = data.cancellationReason;
      updateData.cancelledAt = new Date();
    }
    const updated = await this.appointmentRepository.update(id, updateData);
    if (!updated) {
      throw new Error('UPDATE_FAILED');
    }
    return updated;
  }
  async deleteAppointment(id: string): Promise<void> {
    const appointment = await this.appointmentRepository.findById(id);
    if (!appointment) {
      throw new Error('APPOINTMENT_NOT_FOUND');
    }
    await this.appointmentRepository.delete(id);
  }
  getInsuranceCircuitBreakerStats() {
    return this.insuranceService.getCircuitBreakerStats();
  }
}
