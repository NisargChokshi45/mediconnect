import request from 'supertest';
import app from '../app';
import { 
  authServiceClient, 
  patientServiceClient, 
  doctorServiceClient, 
  appointmentServiceClient, 
  notesServiceClient 
} from '../clients/serviceClient';

jest.mock('../clients/serviceClient');

describe('Gateway Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Auth Routes', () => {
    it('should proxy register', async () => {
      (authServiceClient.post as jest.Mock).mockResolvedValue({ status: 201, data: { success: true } });
      const response = await request(app).post('/api/auth/register').send({ email: 'test@test.com' });
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });

    it('should proxy login', async () => {
      (authServiceClient.post as jest.Mock).mockResolvedValue({ status: 200, data: { token: 't' } });
      const response = await request(app).post('/api/auth/login').send({});
      expect(response.status).toBe(200);
    });

    it('should handle auth service error', async () => {
      (authServiceClient.post as jest.Mock).mockRejectedValue({ response: { status: 400, data: { msg: 'fail' } } });
      const response = await request(app).post('/api/auth/login').send({});
      expect(response.status).toBe(400);
    });

    it('should handle auth service unavailable', async () => {
        (authServiceClient.post as jest.Mock).mockRejectedValue(new Error('timeout'));
        const response = await request(app).post('/api/auth/login').send({});
        expect(response.status).toBe(500);
        expect(response.body.error.code).toBe('SERVICE_UNAVAILABLE');
    });
  });

  describe('Patient Routes', () => {
    it('should proxy GET patient', async () => {
      (patientServiceClient.get as jest.Mock).mockResolvedValue({ status: 200, data: { id: '1' } });
      const response = await request(app).get('/api/patients/1');
      expect(response.status).toBe(200);
    });

    it('should proxy POST patient', async () => {
        (patientServiceClient.post as jest.Mock).mockResolvedValue({ status: 201, data: { id: '1' } });
        const response = await request(app).post('/api/patients').send({});
        expect(response.status).toBe(201);
    });
  });

  describe('Doctor Routes', () => {
    it('should proxy POST doctor', async () => {
      (doctorServiceClient.post as jest.Mock).mockResolvedValue({ status: 201, data: { id: 'd1' } });
      const response = await request(app).post('/api/doctors').send({});
      expect(response.status).toBe(201);
    });

    it('should proxy GET doctor by id', async () => {
      (doctorServiceClient.get as jest.Mock).mockResolvedValue({ status: 200, data: { id: 'd1' } });
      const response = await request(app).get('/api/doctors/d1');
      expect(response.status).toBe(200);
    });

    it('should proxy GET doctors by specialization', async () => {
      (doctorServiceClient.get as jest.Mock).mockResolvedValue({ status: 200, data: [] });
      const response = await request(app).get('/api/doctors/specialization/Cardio');
      expect(response.status).toBe(200);
    });

    it('should proxy PUT doctor', async () => {
      (doctorServiceClient.put as jest.Mock).mockResolvedValue({ status: 200, data: { id: 'd1' } });
      const response = await request(app).put('/api/doctors/d1').send({});
      expect(response.status).toBe(200);
    });
  });

  describe('Appointment Routes', () => {
    it('should proxy POST appointment', async () => {
      (appointmentServiceClient.post as jest.Mock).mockResolvedValue({ status: 201, data: { id: 'a1' } });
      const response = await request(app).post('/api/appointments').send({});
      expect(response.status).toBe(201);
    });

    it('should proxy GET appointment by id', async () => {
      (appointmentServiceClient.get as jest.Mock).mockResolvedValue({ status: 200, data: { id: 'a1' } });
      const response = await request(app).get('/api/appointments/a1');
      expect(response.status).toBe(200);
    });

    it('should proxy GET upcoming appointments', async () => {
      (appointmentServiceClient.get as jest.Mock).mockResolvedValue({ status: 200, data: [] });
      const response = await request(app).get('/api/appointments/patient/p1/upcoming');
      expect(response.status).toBe(200);
    });

    it('should proxy PATCH appointment status', async () => {
      (appointmentServiceClient.put as jest.Mock).mockResolvedValue({ status: 200, data: { status: 'COMPLETED' } });
      const response = await request(app).patch('/api/appointments/a1/status').send({});
      expect(response.status).toBe(200);
    });
  });

  describe('Notes Routes', () => {
    it('should proxy POST note', async () => {
      (notesServiceClient.post as jest.Mock).mockResolvedValue({ status: 201, data: { id: 'n1' } });
      const response = await request(app).post('/api/notes').send({});
      expect(response.status).toBe(201);
    });

    it('should proxy GET note by id', async () => {
      (notesServiceClient.get as jest.Mock).mockResolvedValue({ status: 200, data: { id: 'n1' } });
      const response = await request(app).get('/api/notes/n1');
      expect(response.status).toBe(200);
    });

    it('should proxy GET notes by appointment', async () => {
      (notesServiceClient.get as jest.Mock).mockResolvedValue({ status: 200, data: [] });
      const response = await request(app).get('/api/notes/appointment/a1');
      expect(response.status).toBe(200);
    });

    it('should proxy PUT note', async () => {
      (notesServiceClient.put as jest.Mock).mockResolvedValue({ status: 200, data: { id: 'n1' } });
      const response = await request(app).put('/api/notes/n1').send({});
      expect(response.status).toBe(200);
    });
  });

  describe('Global Error Handler', () => {
      it('should return 500 on unexpected error', async () => {
          // Force an error in one of the routes by mocking a client to throw something that isn't an axios error
          (authServiceClient.post as jest.Mock).mockImplementation(() => { throw new Error('Global fail'); });
          const response = await request(app).post('/api/auth/login').send({});
          expect(response.status).toBe(500);
          expect(response.body.error.code).toBe('GATEWAY_ERROR');
      });
  });
});
