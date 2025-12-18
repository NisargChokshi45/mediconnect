import { Repository, Between } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Appointment, AppointmentStatus } from '../entities/Appointment';

export class AppointmentRepository {
  private repository: Repository<Appointment>;

  constructor() {
    this.repository = AppDataSource.getRepository(Appointment);
  }

  async findById(id: string): Promise<Appointment | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByPatientId(patientId: string): Promise<Appointment[]> {
    return this.repository.find({
      where: { patientId },
      order: { scheduledAt: 'ASC' },
    });
  }

  async findByDoctorId(doctorId: string): Promise<Appointment[]> {
    return this.repository.find({
      where: { doctorId },
      order: { scheduledAt: 'ASC' },
    });
  }

  async findUpcoming(patientId: string): Promise<Appointment[]> {
    return this.repository.find({
      where: {
        patientId,
        status: AppointmentStatus.SCHEDULED,
        scheduledAt: Between(new Date(), new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)),
      },
      order: { scheduledAt: 'ASC' },
    });
  }

  async create(data: Partial<Appointment>): Promise<Appointment> {
    const appointment = this.repository.create(data);
    return this.repository.save(appointment);
  }

  async update(id: string, data: Partial<Appointment>): Promise<Appointment | null> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
