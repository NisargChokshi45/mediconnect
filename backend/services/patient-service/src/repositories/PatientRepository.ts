import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Patient } from '../entities/Patient';

export class PatientRepository {
  private repository: Repository<Patient>;

  constructor() {
    this.repository = AppDataSource.getRepository(Patient);
  }

  async findById(id: string): Promise<Patient | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByUserId(userId: string): Promise<Patient | null> {
    return this.repository.findOne({ where: { userId } });
  }

  async create(data: Partial<Patient>): Promise<Patient> {
    const patient = this.repository.create(data);
    return this.repository.save(patient);
  }

  async update(id: string, data: Partial<Patient>): Promise<Patient | null> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findAll(): Promise<Patient[]> {
    return this.repository.find();
  }
}
