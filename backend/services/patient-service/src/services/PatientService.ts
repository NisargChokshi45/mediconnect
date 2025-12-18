import { PatientRepository } from '../repositories/PatientRepository';
import { CreatePatientDto, UpdatePatientDto } from '../types/dtos';
import { Patient } from '../entities/Patient';

export class PatientService {
  private patientRepository: PatientRepository;

  constructor() {
    this.patientRepository = new PatientRepository();
  }

  async createPatient(data: CreatePatientDto): Promise<Patient> {
    // Check if patient already exists for this user
    const existing = await this.patientRepository.findByUserId(data.userId);
    if (existing) {
      throw new Error('PATIENT_ALREADY_EXISTS');
    }

    // Convert date string to Date object
    const patientData = {
      ...data,
      dateOfBirth: new Date(data.dateOfBirth),
    };

    return this.patientRepository.create(patientData);
  }

  async getPatientById(id: string): Promise<Patient> {
    const patient = await this.patientRepository.findById(id);
    if (!patient) {
      throw new Error('PATIENT_NOT_FOUND');
    }
    return patient;
  }

  async getPatientByUserId(userId: string): Promise<Patient> {
    const patient = await this.patientRepository.findByUserId(userId);
    if (!patient) {
      throw new Error('PATIENT_NOT_FOUND');
    }
    return patient;
  }

  async updatePatient(id: string, data: UpdatePatientDto): Promise<Patient> {
    const patient = await this.patientRepository.findById(id);
    if (!patient) {
      throw new Error('PATIENT_NOT_FOUND');
    }

    const updated = await this.patientRepository.update(id, data);
    if (!updated) {
      throw new Error('UPDATE_FAILED');
    }

    return updated;
  }

  async deletePatient(id: string): Promise<void> {
    const patient = await this.patientRepository.findById(id);
    if (!patient) {
      throw new Error('PATIENT_NOT_FOUND');
    }

    await this.patientRepository.delete(id);
  }

  async getAllPatients(): Promise<Patient[]> {
    return this.patientRepository.findAll();
  }
}
