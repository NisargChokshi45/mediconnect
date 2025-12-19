import { NoteService } from './NoteService';
import { NoteRepository } from '../repositories/NoteRepository';
import axios from 'axios';

jest.mock('../repositories/NoteRepository');
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('NoteService', () => {
  let noteService: NoteService;
  let mockNoteRepository: jest.Mocked<NoteRepository>;

  beforeEach(() => {
    jest.clearAllMocks();
    noteService = new NoteService();
    mockNoteRepository = (noteService as any).noteRepository;
  });

  describe('createNote', () => {
    const createData = {
      appointmentId: '550e8400-e29b-41d4-a716-446655440000',
      doctorId: '550e8400-e29b-41d4-a716-446655440001',
      chiefComplaint: 'Headache',
    };

    it('should create a note successfully', async () => {
      mockedAxios.get.mockResolvedValue({ data: { success: true } });
      mockNoteRepository.create.mockResolvedValue({ ...createData, id: 'n1' } as any);

      const result = await noteService.createNote(
        createData,
        '550e8400-e29b-41d4-a716-446655440001'
      );

      expect(result.id).toBe('n1');
      expect(mockNoteRepository.create).toHaveBeenCalledWith(createData);
    });

    it('should throw UNAUTHORIZED_DOCTOR if doctorId mismatch', async () => {
      await expect(
        noteService.createNote(createData, '550e8400-e29b-41d4-a716-446655440002')
      ).rejects.toThrow('UNAUTHORIZED_DOCTOR');
    });

    it('should throw APPOINTMENT_NOT_FOUND if appointment verify fails', async () => {
      mockedAxios.get.mockRejectedValue(new Error('api fail'));
      await expect(
        noteService.createNote(createData, '550e8400-e29b-41d4-a716-446655440001')
      ).rejects.toThrow('APPOINTMENT_NOT_FOUND');
    });
  });

  describe('getNoteById', () => {
    it('should return note if found', async () => {
      mockNoteRepository.findById.mockResolvedValue({ id: 'n1' } as any);
      const result = await noteService.getNoteById('n1');
      expect(result.id).toBe('n1');
    });

    it('should throw error if not found', async () => {
      mockNoteRepository.findById.mockResolvedValue(null);
      await expect(noteService.getNoteById('n1')).rejects.toThrow('NOTE_NOT_FOUND');
    });
  });

  describe('getNotesByAppointmentId', () => {
    it('should return notes', async () => {
      mockNoteRepository.findByAppointmentId.mockResolvedValue([{ id: 'n1' }] as any);
      const result = await noteService.getNotesByAppointmentId('a1');
      expect(result).toHaveLength(1);
    });
  });

  describe('getNotesByDoctorId', () => {
    it('should return notes', async () => {
      mockNoteRepository.findByDoctorId.mockResolvedValue([{ id: 'n1' }] as any);
      const result = await noteService.getNotesByDoctorId('d1');
      expect(result).toHaveLength(1);
    });
  });

  describe('updateNote', () => {
    it('should update and return note', async () => {
      mockNoteRepository.findById.mockResolvedValue({ id: 'n1', doctorId: 'd1' } as any);
      mockNoteRepository.update.mockResolvedValue({ id: 'n1', chiefComplaint: 'new' } as any);

      const result = await noteService.updateNote('n1', { chiefComplaint: 'new' }, 'd1');
      expect(result.chiefComplaint).toBe('new');
    });

    it('should throw UNAUTHORIZED_DOCTOR if wrong doctor tries to update', async () => {
      mockNoteRepository.findById.mockResolvedValue({ id: 'n1', doctorId: 'd1' } as any);
      await expect(noteService.updateNote('n1', {}, 'd2')).rejects.toThrow('UNAUTHORIZED_DOCTOR');
    });

    it('should throw UPDATE_FAILED if update returns null', async () => {
      mockNoteRepository.findById.mockResolvedValue({ id: 'n1', doctorId: 'd1' } as any);
      mockNoteRepository.update.mockResolvedValue(null);
      await expect(noteService.updateNote('n1', {}, 'd1')).rejects.toThrow('UPDATE_FAILED');
    });

    it('should throw NOTE_NOT_FOUND if note not exists', async () => {
      mockNoteRepository.findById.mockResolvedValue(null);
      await expect(noteService.updateNote('n1', {}, 'd1')).rejects.toThrow('NOTE_NOT_FOUND');
    });
  });

  describe('deleteNote', () => {
    it('should delete note', async () => {
      mockNoteRepository.findById.mockResolvedValue({ id: 'n1', doctorId: 'd1' } as any);
      await noteService.deleteNote('n1', 'd1');
      expect(mockNoteRepository.delete).toHaveBeenCalledWith('n1');
    });

    it('should throw UNAUTHORIZED_DOCTOR if wrong doctor tries to delete', async () => {
      mockNoteRepository.findById.mockResolvedValue({ id: 'n1', doctorId: 'd1' } as any);
      await expect(noteService.deleteNote('n1', 'd2')).rejects.toThrow('UNAUTHORIZED_DOCTOR');
    });

    it('should throw NOTE_NOT_FOUND if note not exists', async () => {
      mockNoteRepository.findById.mockResolvedValue(null);
      await expect(noteService.deleteNote('n1', 'd1')).rejects.toThrow('NOTE_NOT_FOUND');
    });
  });
});
