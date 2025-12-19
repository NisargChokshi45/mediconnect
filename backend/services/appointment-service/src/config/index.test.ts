import { loadConfig } from './index';

describe('Config', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    const varsToClear = [
      'NODE_ENV', 'PORT',
      'DB_HOST', 'DB_PORT', 'DB_USERNAME', 'DB_PASSWORD', 'DB_NAME', 'DB_SSL',
      'AUTH_SERVICE_URL', 'PATIENT_SERVICE_URL', 'DOCTOR_SERVICE_URL',
      'INSURANCE_API_URL', 'INSURANCE_API_KEY',
      'LOG_LEVEL'
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
    process.env.INSURANCE_API_URL = 'http://insurance';
    process.env.INSURANCE_API_KEY = 'key';

    const config = loadConfig();
    
    expect(config.env).toBe('development');
    expect(config.port).toBe(3004);
    expect(config.database.host).toBe('localhost');
  });

  it('should use provided values', () => {
    process.env.NODE_ENV = 'production';
    process.env.PORT = '4504';
    process.env.AUTH_SERVICE_URL = 'http://auth';
    process.env.PATIENT_SERVICE_URL = 'http://patient';
    process.env.DOCTOR_SERVICE_URL = 'http://doctor';
    process.env.INSURANCE_API_URL = 'http://insurance';
    process.env.INSURANCE_API_KEY = 'key';

    const config = loadConfig();
    expect(config.port).toBe(4504);
    expect(config.env).toBe('production');
  });
});
