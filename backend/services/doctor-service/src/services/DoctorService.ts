import { DoctorRepository } from '../repositories/DoctorRepository';
import { CreateDoctorDto, UpdateDoctorDto } from '../types/dtos';
import { Doctor } from '../entities/Doctor';

export class DoctorService {
  private doctorRepository: DoctorRepository;

  constructor() {
    this.doctorRepository = new DoctorRepository();
  }

  async createDoctor(data: CreateDoctorDto): Promise<Doctor> {
    const existing = await this.doctorRepository.findByUserId(data.userId);
    if (existing) {
      throw new Error('DOCTOR_ALREADY_EXISTS');
    }

    return this.doctorRepository.create(data);
  }

  async getDoctorById(id: string): Promise<Doctor> {
    const doctor = await this.doctorRepository.findById(id);
    if (!doctor) {
      throw new Error('DOCTOR_NOT_FOUND');
    }
    return doctor;
  }

  async getDoctorByUserId(userId: string): Promise<Doctor> {
    const doctor = await this.doctorRepository.findByUserId(userId);
    if (!doctor) {
      throw new Error('DOCTOR_NOT_FOUND');
    }
    return doctor;
  }

  async getDoctorsBySpecialization(specialization: string): Promise<Doctor[]> {
    return this.doctorRepository.findBySpecialization(specialization);
  }

  async updateDoctor(id: string, data: UpdateDoctorDto): Promise<Doctor> {
    const doctor = await this.doctorRepository.findById(id);
    if (!doctor) {
      throw new Error('DOCTOR_NOT_FOUND');
    }

    const updated = await this.doctorRepository.update(id, data);
    if (!updated) {
      throw new Error('UPDATE_FAILED');
    }

    return updated;
  }

  async deleteDoctor(id: string): Promise<void> {
    const doctor = await this.doctorRepository.findById(id);
    if (!doctor) {
      throw new Error('DOCTOR_NOT_FOUND');
    }

    await this.doctorRepository.delete(id);
  }

  async getAllDoctors(): Promise<Doctor[]> {
    return this.doctorRepository.findAll();
  }
}
