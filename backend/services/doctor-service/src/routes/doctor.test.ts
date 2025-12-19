import request from 'supertest';
import express from 'express';
import router from './doctor';
import { DoctorService } from '../services/DoctorService';
import { errorHandler } from '../middleware/errorHandler';

jest.mock('../services/DoctorService');
jest.mock('../utils/logger', () => ({
  createLogger: () => ({
    info: jest.fn(),
    error: jest.fn(),
  }),
}));

jest.mock('../middleware/auth', () => ({
  authMiddleware: (req: any, res: any, next: any) => {
    req.user = { userId: 'user-123', role: 'ADMIN' };
    next();
  },
  requireRole: (roles: string[]) => (req: any, res: any, next: any) => next(),
}));

const app = express();
app.use(express.json());
app.use('/doctors', router);
app.use(errorHandler);

describe('Doctor Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /doctors', () => {
    it('should create a doctor and return 201', async () => {
      const mockDoctor = { id: 'doctor-123' };
      (DoctorService.prototype.createDoctor as jest.Mock).mockResolvedValue(mockDoctor);

      const response = await request(app).post('/doctors').send({
        userId: '550e8400-e29b-41d4-a716-446655440000',
        firstName: 'Sarah',
        lastName: 'Williams',
        specialization: 'Cardiology',
        licenseNumber: 'MD-123',
        phone: '1234567890',
        consultationDuration: 30,
        yearsOfExperience: 5,
      });

      expect(response.status).toBe(201);
      expect(response.body.data).toEqual(mockDoctor);
    });

    it('should handle errors', async () => {
      (DoctorService.prototype.createDoctor as jest.Mock).mockRejectedValue(
        new Error('DOCTOR_ALREADY_EXISTS')
      );
      const response = await request(app).post('/doctors').send({
        userId: '550e8400-e29b-41d4-a716-446655440000',
        firstName: 'Sarah',
        lastName: 'Williams',
        specialization: 'Cardiology',
        licenseNumber: 'MD-123',
        phone: '1234567890',
        consultationDuration: 30,
        yearsOfExperience: 5,
      });
      expect(response.status).toBe(409);
    });
  });

  describe('GET /doctors/:id', () => {
    it('should get doctor by id', async () => {
      const mockDoctor = { id: '123' };
      (DoctorService.prototype.getDoctorById as jest.Mock).mockResolvedValue(mockDoctor);
      const response = await request(app).get('/doctors/123');
      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockDoctor);
    });
  });

  describe('GET /doctors/user/:userId', () => {
    it('should get doctor by user id', async () => {
      const mockDoctor = { userId: 'user-123' };
      (DoctorService.prototype.getDoctorByUserId as jest.Mock).mockResolvedValue(mockDoctor);
      const response = await request(app).get('/doctors/user/user-123');
      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockDoctor);
    });
  });

  describe('GET /doctors/specialization/:spec', () => {
    it('should get doctors by specialization', async () => {
      const mockDoctors = [{ id: '1' }];
      (DoctorService.prototype.getDoctorsBySpecialization as jest.Mock).mockResolvedValue(
        mockDoctors
      );
      const response = await request(app).get('/doctors/specialization/Cardio');
      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockDoctors);
    });
  });

  describe('PUT /doctors/:id', () => {
    it('should update doctor', async () => {
      const mockDoctor = { id: '123' };
      (DoctorService.prototype.updateDoctor as jest.Mock).mockResolvedValue(mockDoctor);
      const response = await request(app).put('/doctors/123').send({ phone: '999' });
      expect(response.status).toBe(200);
    });
  });

  describe('DELETE /doctors/:id', () => {
    it('should delete doctor', async () => {
      (DoctorService.prototype.deleteDoctor as jest.Mock).mockResolvedValue(undefined);
      const response = await request(app).delete('/doctors/123');
      expect(response.status).toBe(204);
    });

    it('should handle errors', async () => {
      (DoctorService.prototype.deleteDoctor as jest.Mock).mockRejectedValue(new Error('fail'));
      const response = await request(app).delete('/doctors/123');
      expect(response.status).toBe(500);
    });
  });

  describe('Error Catch Blocks', () => {
    it('should handle POST error', async () => {
      (DoctorService.prototype.createDoctor as jest.Mock).mockRejectedValue(new Error('fail'));
      const response = await request(app).post('/doctors').send({
        userId: '550e8400-e29b-41d4-a716-446655440000',
        firstName: 'Sarah',
        lastName: 'Williams',
        specialization: 'Cardiology',
        licenseNumber: 'MD-123',
        phone: '1234567890',
        consultationDuration: 30,
        yearsOfExperience: 5,
      });
      expect(response.status).toBe(500);
    });

    it('should handle GET by id error', async () => {
      (DoctorService.prototype.getDoctorById as jest.Mock).mockRejectedValue(new Error('fail'));
      const response = await request(app).get('/doctors/123');
      expect(response.status).toBe(500);
    });

    it('should handle GET by user id error', async () => {
      (DoctorService.prototype.getDoctorByUserId as jest.Mock).mockRejectedValue(new Error('fail'));
      const response = await request(app).get('/doctors/user/u1');
      expect(response.status).toBe(500);
    });

    it('should handle GET by specialization error', async () => {
      (DoctorService.prototype.getDoctorsBySpecialization as jest.Mock).mockRejectedValue(
        new Error('fail')
      );
      const response = await request(app).get('/doctors/specialization/Cardio');
      expect(response.status).toBe(500);
    });

    it('should handle PUT error', async () => {
      (DoctorService.prototype.updateDoctor as jest.Mock).mockRejectedValue(new Error('fail'));
      const response = await request(app).put('/doctors/123').send({ phone: '123' });
      expect(response.status).toBe(500);
    });
  });
});
