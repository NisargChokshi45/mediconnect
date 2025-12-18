import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Doctor } from '../entities/Doctor';

export class DoctorRepository {
  private repository: Repository<Doctor>;

  constructor() {
    this.repository = AppDataSource.getRepository(Doctor);
  }

  async findById(id: string): Promise<Doctor | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByUserId(userId: string): Promise<Doctor | null> {
    return this.repository.findOne({ where: { userId } });
  }

  async findBySpecialization(specialization: string): Promise<Doctor[]> {
    return this.repository.find({ where: { specialization, isAcceptingPatients: true } });
  }

  async create(data: Partial<Doctor>): Promise<Doctor> {
    const doctor = this.repository.create(data);
    return this.repository.save(doctor);
  }

  async update(id: string, data: Partial<Doctor>): Promise<Doctor | null> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findAll(): Promise<Doctor[]> {
    return this.repository.find();
  }
}
