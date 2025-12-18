import { NoteRepository } from '../repositories/NoteRepository';
import { CreateNoteDto, UpdateNoteDto } from '../types/dtos';
import { Note } from '../entities/Note';
import axios from 'axios';
import { config } from '../config';

export class NoteService {
  private noteRepository: NoteRepository;

  constructor() {
    this.noteRepository = new NoteRepository();
  }

  async createNote(data: CreateNoteDto, requestingDoctorId: string): Promise<Note> {
    // Verify doctor is authorized (matches requesting doctor)
    if (data.doctorId !== requestingDoctorId) {
      throw new Error('UNAUTHORIZED_DOCTOR');
    }

    // Verify appointment exists
    try {
      await axios.get(`${config.appointmentService.url}/api/appointments/${data.appointmentId}`);
    } catch (error) {
      throw new Error('APPOINTMENT_NOT_FOUND');
    }

    return this.noteRepository.create(data);
  }

  async getNoteById(id: string): Promise<Note> {
    const note = await this.noteRepository.findById(id);
    if (!note) {
      throw new Error('NOTE_NOT_FOUND');
    }
    return note;
  }

  async getNotesByAppointmentId(appointmentId: string): Promise<Note[]> {
    return this.noteRepository.findByAppointmentId(appointmentId);
  }

  async getNotesByDoctorId(doctorId: string): Promise<Note[]> {
    return this.noteRepository.findByDoctorId(doctorId);
  }

  async updateNote(id: string, data: UpdateNoteDto, requestingDoctorId: string): Promise<Note> {
    const note = await this.noteRepository.findById(id);
    if (!note) {
      throw new Error('NOTE_NOT_FOUND');
    }

    // Only the doctor who created the note can update it
    if (note.doctorId !== requestingDoctorId) {
      throw new Error('UNAUTHORIZED_DOCTOR');
    }

    const updated = await this.noteRepository.update(id, data);
    if (!updated) {
      throw new Error('UPDATE_FAILED');
    }

    return updated;
  }

  async deleteNote(id: string, requestingDoctorId: string): Promise<void> {
    const note = await this.noteRepository.findById(id);
    if (!note) {
      throw new Error('NOTE_NOT_FOUND');
    }

    // Only the doctor who created the note can delete it
    if (note.doctorId !== requestingDoctorId) {
      throw new Error('UNAUTHORIZED_DOCTOR');
    }

    await this.noteRepository.delete(id);
  }
}
