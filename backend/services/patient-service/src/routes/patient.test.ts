import request from 'supertest';
import express from 'express';
import router from './patient';
import { PatientService } from '../services/PatientService';
import { errorHandler } from '../middleware/errorHandler';

jest.mock('../services/PatientService');
jest.mock('../../../../shared/logger', () => ({
  createLogger: () => ({
    info: jest.fn(),
    error: jest.fn(),
  }),
}));

// Mock auth middleware to skip actual auth service calls
jest.mock('../middleware/auth', () => ({
  authMiddleware: (req: any, res: any, next: any) => {
    req.user = { userId: 'user-123', role: 'ADMIN' };
    next();
  },
  requireRole: (roles: string[]) => (req: any, res: any, next: any) => next(),
}));

const app = express();
app.use(express.json());
app.use('/patients', router);
app.use(errorHandler);

describe('Patient Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /patients', () => {
    it('should create a patient and return 201', async () => {
      const mockPatient = { id: 'patient-123', firstName: 'John' };
      (PatientService.prototype.createPatient as jest.Mock).mockResolvedValue(mockPatient);

      const response = await request(app)
        .post('/patients')
        .send({
          userId: '550e8400-e29b-41d4-a716-446655440000',
          firstName: 'John',
          lastName: 'Doe',
          dateOfBirth: '1990-01-01',
          phone: '1234567890',
          bloodGroup: 'O+'
        });

      expect(response.status).toBe(201);
      expect(response.body.data).toEqual(mockPatient);
    });

    it('should handle errors', async () => {
      (PatientService.prototype.createPatient as jest.Mock).mockRejectedValue(new Error('PATIENT_ALREADY_EXISTS'));

      const response = await request(app)
        .post('/patients')
        .send({
          userId: '550e8400-e29b-41d4-a716-446655440000',
          firstName: 'John',
          lastName: 'Doe',
          dateOfBirth: '1990-01-01',
          phone: '1234567890',
          bloodGroup: 'O+'
        });

      expect(response.status).toBe(409);
    });
  });

  describe('GET /patients/:id', () => {
    it('should get patient by id', async () => {
      const mockPatient = { id: '123' };
      (PatientService.prototype.getPatientById as jest.Mock).mockResolvedValue(mockPatient);

      const response = await request(app).get('/patients/123');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockPatient);
    });

    it('should handle not found', async () => {
        (PatientService.prototype.getPatientById as jest.Mock).mockRejectedValue(new Error('PATIENT_NOT_FOUND'));
        const response = await request(app).get('/patients/123');
        expect(response.status).toBe(404);
    });
  });

  describe('GET /patients/user/:userId', () => {
    it('should get patient by user id', async () => {
      const mockPatient = { userId: 'user-123' };
      (PatientService.prototype.getPatientByUserId as jest.Mock).mockResolvedValue(mockPatient);

      const response = await request(app).get('/patients/user/user-123');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockPatient);
    });

    it('should handle errors', async () => {
        (PatientService.prototype.getPatientByUserId as jest.Mock).mockRejectedValue(new Error('Generic error'));
        const response = await request(app).get('/patients/user/user-123');
        expect(response.status).toBe(500);
    });
  });

  describe('PUT /patients/:id', () => {
    it('should update patient', async () => {
      const mockPatient = { id: '123', firstName: 'Updated' };
      (PatientService.prototype.updatePatient as jest.Mock).mockResolvedValue(mockPatient);

      const response = await request(app)
        .put('/patients/123')
        .send({ firstName: 'Updated' });

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockPatient);
    });

    it('should handle errors', async () => {
        (PatientService.prototype.updatePatient as jest.Mock).mockRejectedValue(new Error('Generic error'));
        const response = await request(app).put('/patients/123').send({ firstName: 'Updated' });
        expect(response.status).toBe(500);
    });
  });

  describe('DELETE /patients/:id', () => {
    it('should delete patient', async () => {
      (PatientService.prototype.deletePatient as jest.Mock).mockResolvedValue(undefined);

      const response = await request(app).delete('/patients/123');

      expect(response.status).toBe(204);
    });

    it('should handle errors', async () => {
        (PatientService.prototype.deletePatient as jest.Mock).mockRejectedValue(new Error('Generic error'));
        const response = await request(app).delete('/patients/123');
        expect(response.status).toBe(500);
    });
  });
});
