import request from 'supertest';
import express from 'express';
import router from './note';
import { NoteService } from '../services/NoteService';
import { errorHandler } from '../middleware/errorHandler';

jest.mock('../services/NoteService');
jest.mock('../../../../shared/logger', () => ({
  createLogger: () => ({ info: jest.fn(), error: jest.fn() }),
}));

jest.mock('../middleware/auth', () => ({
  authMiddleware: (req: any, res: any, next: any) => {
    req.user = { userId: '550e8400-e29b-41d4-a716-446655440001', role: 'DOCTOR' };
    next();
  },
  requireRole: (roles: string[]) => (req: any, res: any, next: any) => next(),
}));

const app = express();
app.use(express.json());
app.use('/notes', router);
app.use(errorHandler);

describe('Note Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /notes', () => {
    it('should create note', async () => {
      const mockNote = { id: 'n1' };
      (NoteService.prototype.createNote as jest.Mock).mockResolvedValue(mockNote);

      const response = await request(app)
        .post('/notes')
        .send({
          appointmentId: '550e8400-e29b-41d4-a716-446655440000',
          doctorId: '550e8400-e29b-41d4-a716-446655440001',
          chiefComplaint: 'Pain'
        });

      expect(response.status).toBe(201);
    });
  });

  describe('GET /notes/:id', () => {
    it('should get note', async () => {
      (NoteService.prototype.getNoteById as jest.Mock).mockResolvedValue({ id: 'n1' });
      const response = await request(app).get('/notes/n1');
      expect(response.status).toBe(200);
    });
  });

  describe('GET /notes/appointment/:appointmentId', () => {
    it('should get notes by appointment', async () => {
      (NoteService.prototype.getNotesByAppointmentId as jest.Mock).mockResolvedValue([]);
      const response = await request(app).get('/notes/appointment/a1');
      expect(response.status).toBe(200);
    });
  });

  describe('GET /notes/doctor/:doctorId', () => {
    it('should get notes by doctor', async () => {
      (NoteService.prototype.getNotesByDoctorId as jest.Mock).mockResolvedValue([]);
      const response = await request(app).get('/notes/doctor/d1');
      expect(response.status).toBe(200);
    });
  });

  describe('PUT /notes/:id', () => {
    it('should update note', async () => {
      (NoteService.prototype.updateNote as jest.Mock).mockResolvedValue({ id: 'n1' });
      const response = await request(app).put('/notes/n1').send({ chiefComplaint: 'Updated' });
      expect(response.status).toBe(200);
    });
  });

  describe('DELETE /notes/:id', () => {
    it('should delete note', async () => {
      (NoteService.prototype.deleteNote as jest.Mock).mockResolvedValue(undefined);
      const response = await request(app).delete('/notes/n1');
      expect(response.status).toBe(204);
    });

    it('should handle errors', async () => {
      (NoteService.prototype.deleteNote as jest.Mock).mockRejectedValue(new Error('fail'));
      const response = await request(app).delete('/notes/n1');
      expect(response.status).toBe(500);
    });
  });

  describe('Error Catch Blocks', () => {
    it('should handle POST error', async () => {
      (NoteService.prototype.createNote as jest.Mock).mockRejectedValue(new Error('fail'));
      const response = await request(app).post('/notes').send({ appointmentId: '550e8400-e29b-41d4-a716-446655440000', doctorId: '550e8400-e29b-41d4-a716-446655440001', chiefComplaint: 'Pain' });
      expect(response.status).toBe(500);
    });

    it('should handle GET by id error', async () => {
      (NoteService.prototype.getNoteById as jest.Mock).mockRejectedValue(new Error('fail'));
      const response = await request(app).get('/notes/n1');
      expect(response.status).toBe(500);
    });

    it('should handle GET by appointment error', async () => {
      (NoteService.prototype.getNotesByAppointmentId as jest.Mock).mockRejectedValue(new Error('fail'));
      const response = await request(app).get('/notes/appointment/a1');
      expect(response.status).toBe(500);
    });

    it('should handle GET by doctor error', async () => {
      (NoteService.prototype.getNotesByDoctorId as jest.Mock).mockRejectedValue(new Error('fail'));
      const response = await request(app).get('/notes/doctor/d1');
      expect(response.status).toBe(500);
    });

    it('should handle PUT error', async () => {
      (NoteService.prototype.updateNote as jest.Mock).mockRejectedValue(new Error('fail'));
      const response = await request(app).put('/notes/n1').send({ chiefComplaint: 'Updated' });
      expect(response.status).toBe(500);
    });
  });
});
