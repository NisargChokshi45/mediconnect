import { loadConfig } from './index';

describe('Config', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    // Clear all relevant environment variables
    const varsToClear = [
      'NODE_ENV',
      'PORT',
      'DB_HOST',
      'DB_PORT',
      'DB_USERNAME',
      'DB_PASSWORD',
      'DB_NAME',
      'DB_SSL',
      'JWT_SECRET',
      'JWT_EXPIRES_IN',
      'AUDIT_SERVICE_URL',
      'JAEGER_ENDPOINT',
      'OTEL_SERVICE_NAME',
      'LOG_LEVEL',
    ];
    varsToClear.forEach((v) => delete process.env[v]);
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should use default values where available', () => {
    process.env.JWT_SECRET = 'a'.repeat(32);
    process.env.JAEGER_ENDPOINT = 'http://jaeger:14268';

    const config = loadConfig();

    expect(config.env).toBe('development');
    expect(config.port).toBe(3001);
    expect(config.database.host).toBe('localhost');
    expect(config.database.port).toBe(5432);
    expect(config.database.ssl).toBe(false);
    expect(config.jwt.expiresIn).toBe('24h');
    expect(config.observability.serviceName).toBe('auth-service');
    expect(config.logging.level).toBe('info');
    expect(config.auditService.url).toBeUndefined();
  });

  it('should use provided values', () => {
    process.env.NODE_ENV = 'production';
    process.env.PORT = '4000';
    process.env.DB_HOST = 'remote-host';
    process.env.DB_PORT = '6432';
    process.env.DB_USERNAME = 'user';
    process.env.DB_PASSWORD = 'pass';
    process.env.DB_NAME = 'db';
    process.env.DB_SSL = 'true';
    process.env.JWT_SECRET = 'b'.repeat(32);
    process.env.JWT_EXPIRES_IN = '1h';
    process.env.AUDIT_SERVICE_URL = 'http://audit';
    process.env.JAEGER_ENDPOINT = 'http://jaeger:14268';
    process.env.OTEL_SERVICE_NAME = 'custom-auth-service';
    process.env.LOG_LEVEL = 'error';

    const config = loadConfig();

    expect(config.env).toBe('production');
    expect(config.port).toBe(4000);
    expect(config.database.ssl).toBe(true);
    expect(config.jwt.expiresIn).toBe('1h');
    // Zod URL parsing might append /
    expect(config.auditService.url).toMatch(/^http:\/\/audit\/?$/);
    expect(config.logging.level).toBe('error');
  });

  it('should handle optional audit url being present', () => {
    process.env.JWT_SECRET = 'a'.repeat(32);
    process.env.JAEGER_ENDPOINT = 'http://jaeger:14268';
    process.env.AUDIT_SERVICE_URL = 'http://audit-service';
    const config = loadConfig();
    expect(config.auditService.url).not.toBeUndefined();
  });
});
