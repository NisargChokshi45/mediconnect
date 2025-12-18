import axios, { AxiosInstance } from 'axios';
import { config } from '../config';

class ServiceClient {
  private client: AxiosInstance;

  constructor(private serviceName: string, private baseURL: string) {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async get(path: string, headers: Record<string, string> = {}) {
    return this.client.get(path, { headers });
  }

  async post(path: string, data: any, headers: Record<string, string> = {}) {
    return this.client.post(path, data, { headers });
  }

  async put(path: string, data: any, headers: Record<string, string> = {}) {
    return this.client.put(path, data, { headers });
  }

  async delete(path: string, headers: Record<string, string> = {}) {
    return this.client.delete(path, { headers });
  }
}

export const authServiceClient = new ServiceClient('auth-service', config.services.authService);
export const patientServiceClient = new ServiceClient(
  'patient-service',
  config.services.patientService
);
export const doctorServiceClient = new ServiceClient(
  'doctor-service',
  config.services.doctorService
);
export const appointmentServiceClient = new ServiceClient(
  'appointment-service',
  config.services.appointmentService
);
export const notesServiceClient = new ServiceClient('notes-service', config.services.notesService);
