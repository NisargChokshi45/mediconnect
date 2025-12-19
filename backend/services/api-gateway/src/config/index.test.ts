import { loadConfig } from './index';

describe('Config', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    const varsToClear = [
      'NODE_ENV', 'PORT',
      'AUTH_SERVICE_URL', 'PATIENT_SERVICE_URL', 'DOCTOR_SERVICE_URL', 
      'APPOINTMENT_SERVICE_URL', 'NOTES_SERVICE_URL',
      'JAEGER_ENDPOINT', 'OTEL_SERVICE_NAME', 'LOG_LEVEL'
    ];
    varsToClear.forEach(v => delete process.env[v]);
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should use default values where available', () => {
    process.env.AUTH_SERVICE_URL = 'http://auth';
    process.env.PATIENT_SERVICE_URL = 'http://patient';
    process.env.DOCTOR_SERVICE_URL = 'http://doctor';
    process.env.APPOINTMENT_SERVICE_URL = 'http://appointment';
    process.env.NOTES_SERVICE_URL = 'http://notes';
    process.env.JAEGER_ENDPOINT = 'http://jaeger';

    const config = loadConfig();
    
    expect(config.env).toBe('development');
    expect(config.port).toBe(3000);
    expect(config.observability.serviceName).toBe('api-gateway');
  });

  it('should use provided values', () => {
    process.env.NODE_ENV = 'production';
    process.env.PORT = '4500';
    process.env.AUTH_SERVICE_URL = 'http://auth';
    process.env.PATIENT_SERVICE_URL = 'http://patient';
    process.env.DOCTOR_SERVICE_URL = 'http://doctor';
    process.env.APPOINTMENT_SERVICE_URL = 'http://appointment';
    process.env.NOTES_SERVICE_URL = 'http://notes';
    process.env.JAEGER_ENDPOINT = 'http://jaeger';

    const config = loadConfig();
    expect(config.port).toBe(4500);
    expect(config.env).toBe('production');
  });
});
