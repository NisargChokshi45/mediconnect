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

// Mock helmet to trigger the global error handler for coverage
jest.mock('helmet', () => {
    return jest.fn(() => (req: any, res: any, next: any) => {
        if (req.headers['x-test-error']) {
            return next(new Error('Global error trigger'));
        }
        next();
    });
});

describe('Gateway Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Health Check', () => {
    it('should return 200/healthy', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
    });
  });

  describe('Global Error Handler', () => {
    it('should handle errors from middleware', async () => {
        const response = await request(app).get('/health').set('x-test-error', 'yes');
        expect(response.status).toBe(500);
        expect(response.body.error.code).toBe('GATEWAY_ERROR');
    });
  });

  const testProxy = async (serviceMock: any, serviceMethod: string, requestMethod: string, path: string, body?: any) => {
      serviceMock[serviceMethod].mockResolvedValue({ status: 200, data: { success: true } });
      const req = (request(app) as any)[requestMethod](path);
      if (body) req.send(body);
      const response = await req;
      expect(response.status).toBe(200);
      
      // Test 400 error
      serviceMock[serviceMethod].mockRejectedValue({ response: { status: 400, data: { error: 'bad' } } });
      const response400 = await (request(app) as any)[requestMethod](path).send(body || {});
      expect(response400.status).toBe(400);

      // Test 500 error (service unavailable)
      serviceMock[serviceMethod].mockRejectedValue(new Error('fail'));
      const response500 = await (request(app) as any)[requestMethod](path).send(body || {});
      expect(response500.status).toBe(500);
  };

  describe('Auth Routes', () => {
    it('should proxy auth register/login', async () => {
        await testProxy(authServiceClient, 'post', 'post', '/api/auth/register', { email: 't@t.com' });
        await testProxy(authServiceClient, 'post', 'post', '/api/auth/login', { email: 't@t.com' });
    });
  });

  describe('Patient Routes', () => {
    it('should proxy patient routes', async () => {
        await testProxy(patientServiceClient, 'post', 'post', '/api/patients', {});
        await testProxy(patientServiceClient, 'get', 'get', '/api/patients/1');
    });
  });

  describe('Doctor Routes', () => {
    it('should proxy doctor routes', async () => {
        await testProxy(doctorServiceClient, 'post', 'post', '/api/doctors', {});
        await testProxy(doctorServiceClient, 'get', 'get', '/api/doctors/123');
        await testProxy(doctorServiceClient, 'get', 'get', '/api/doctors/specialization/Cardio');
        await testProxy(doctorServiceClient, 'put', 'put', '/api/doctors/123', {});
    });
  });

  describe('Appointment Routes', () => {
    it('should proxy appointment routes', async () => {
        await testProxy(appointmentServiceClient, 'post', 'post', '/api/appointments', {});
        await testProxy(appointmentServiceClient, 'get', 'get', '/api/appointments/123');
        await testProxy(appointmentServiceClient, 'get', 'get', '/api/appointments/patient/p1/upcoming');
        // NOTE: appointment gateway uses PUT on the backend for status update 
        await testProxy(appointmentServiceClient, 'put', 'patch', '/api/appointments/123/status', { status: 'COMPLETED' });
    });
  });

  describe('Notes Routes', () => {
    it('should proxy notes routes', async () => {
        await testProxy(notesServiceClient, 'post', 'post', '/api/notes', {});
        await testProxy(notesServiceClient, 'get', 'get', '/api/notes/123');
        await testProxy(notesServiceClient, 'get', 'get', '/api/notes/appointment/123');
        await testProxy(notesServiceClient, 'put', 'put', '/api/notes/123', {});
    });
  });
});
