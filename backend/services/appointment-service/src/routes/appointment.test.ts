import request from 'supertest';
import express from 'express';
import router from './appointment';
import { AppointmentService } from '../services/AppointmentService';
import { errorHandler } from '../middleware/errorHandler';

jest.mock('../services/AppointmentService');
jest.mock('../utils/logger', () => ({
  createLogger: () => ({ info: jest.fn(), error: jest.fn() }),
}));

jest.mock('../middleware/auth', () => ({
  authMiddleware: (req: any, res: any, next: any) => {
    req.user = { userId: 'u1', role: 'ADMIN' };
    next();
  },
  requireRole: (roles: string[]) => (req: any, res: any, next: any) => next(),
}));

const app = express();
app.use(express.json());
app.use('/appointments', router);
app.use(errorHandler);

describe('Appointment Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /appointments', () => {
    it('should create appointment', async () => {
      (AppointmentService.prototype.createAppointment as jest.Mock).mockResolvedValue({ id: 'a1' });
      const response = await request(app).post('/appointments').send({
        patientId: '550e8400-e29b-41d4-a716-446655440000',
        doctorId: '550e8400-e29b-41d4-a716-446655440001',
        scheduledAt: '2025-01-01T10:00:00Z',
        reason: 'Checkup',
      });
      expect(response.status).toBe(201);
    });
  });

  describe('GET /appointments/:id', () => {
    it('should get appointment', async () => {
      (AppointmentService.prototype.getAppointmentById as jest.Mock).mockResolvedValue({
        id: 'a1',
      });
      const response = await request(app).get('/appointments/a1');
      expect(response.status).toBe(200);
    });
  });

  describe('GET /appointments/patient/:id', () => {
    it('should get patient appointments', async () => {
      (AppointmentService.prototype.getPatientAppointments as jest.Mock).mockResolvedValue([]);
      const response = await request(app).get('/appointments/patient/p1');
      expect(response.status).toBe(200);
    });
  });

  describe('GET /appointments/doctor/:id', () => {
    it('should get doctor appointments', async () => {
      (AppointmentService.prototype.getDoctorAppointments as jest.Mock).mockResolvedValue([]);
      const response = await request(app).get('/appointments/doctor/d1');
      expect(response.status).toBe(200);
    });
  });

  describe('GET /appointments/patient/:id/upcoming', () => {
    it('should get upcoming appointments', async () => {
      (AppointmentService.prototype.getUpcomingAppointments as jest.Mock).mockResolvedValue([]);
      const response = await request(app).get('/appointments/patient/p1/upcoming');
      expect(response.status).toBe(200);
    });
  });

  describe('PATCH /appointments/:id/status', () => {
    it('should update status', async () => {
      (AppointmentService.prototype.updateAppointmentStatus as jest.Mock).mockResolvedValue({
        id: 'a1',
      });
      const response = await request(app)
        .patch('/appointments/a1/status')
        .send({ status: 'COMPLETED' });
      expect(response.status).toBe(200);
    });
  });

  describe('DELETE /appointments/:id', () => {
    it('should delete', async () => {
      (AppointmentService.prototype.deleteAppointment as jest.Mock).mockResolvedValue(undefined);
      const response = await request(app).delete('/appointments/a1');
      expect(response.status).toBe(204);
    });

    it('should handle errors', async () => {
      (AppointmentService.prototype.deleteAppointment as jest.Mock).mockRejectedValue(
        new Error('fail')
      );
      const response = await request(app).delete('/appointments/a1');
      expect(response.status).toBe(500);
    });
  });

  describe('Error Catch Blocks', () => {
    it('should handle POST error', async () => {
      (AppointmentService.prototype.createAppointment as jest.Mock).mockRejectedValue(
        new Error('fail')
      );
      const response = await request(app).post('/appointments').send({
        patientId: '550e8400-e29b-41d4-a716-446655440000',
        doctorId: '550e8400-e29b-41d4-a716-446655440001',
        scheduledAt: '2025-01-01T10:00:00Z',
        reason: 'Checkup',
      });
      expect(response.status).toBe(500);
    });

    it('should handle GET by id error', async () => {
      (AppointmentService.prototype.getAppointmentById as jest.Mock).mockRejectedValue(
        new Error('fail')
      );
      const response = await request(app).get('/appointments/a1');
      expect(response.status).toBe(500);
    });

    it('should handle GET by patient id error', async () => {
      (AppointmentService.prototype.getPatientAppointments as jest.Mock).mockRejectedValue(
        new Error('fail')
      );
      const response = await request(app).get('/appointments/patient/p1');
      expect(response.status).toBe(500);
    });

    it('should handle GET by doctor id error', async () => {
      (AppointmentService.prototype.getDoctorAppointments as jest.Mock).mockRejectedValue(
        new Error('fail')
      );
      const response = await request(app).get('/appointments/doctor/d1');
      expect(response.status).toBe(500);
    });

    it('should handle GET upcoming error', async () => {
      (AppointmentService.prototype.getUpcomingAppointments as jest.Mock).mockRejectedValue(
        new Error('fail')
      );
      const response = await request(app).get('/appointments/patient/p1/upcoming');
      expect(response.status).toBe(500);
    });

    it('should handle PATCH status error', async () => {
      (AppointmentService.prototype.updateAppointmentStatus as jest.Mock).mockRejectedValue(
        new Error('fail')
      );
      const response = await request(app)
        .patch('/appointments/a1/status')
        .send({ status: 'COMPLETED' });
      expect(response.status).toBe(500);
    });
  });

  describe('GET /metrics/circuit-breaker', () => {
    it('should return stats', async () => {
      (AppointmentService.prototype.getInsuranceCircuitBreakerStats as jest.Mock).mockReturnValue(
        {}
      );
      const response = await request(app).get('/appointments/metrics/circuit-breaker');
      expect(response.status).toBe(200);
    });
  });
});
