import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Note } from '../entities/Note';

export class NoteRepository {
  private repository: Repository<Note>;

  constructor() {
    this.repository = AppDataSource.getRepository(Note);
  }

  async findById(id: string): Promise<Note | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByAppointmentId(appointmentId: string): Promise<Note[]> {
    return this.repository.find({ where: { appointmentId }, order: { createdAt: 'DESC' } });
  }

  async findByDoctorId(doctorId: string): Promise<Note[]> {
    return this.repository.find({ where: { doctorId }, order: { createdAt: 'DESC' } });
  }

  async create(data: Partial<Note>): Promise<Note> {
    const note = this.repository.create(data);
    return this.repository.save(note);
  }

  async update(id: string, data: Partial<Note>): Promise<Note | null> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
