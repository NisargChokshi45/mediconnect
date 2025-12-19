import { z } from 'zod';

describe('Config Branch Coverage', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should use default values when env vars are missing', () => {
    // Clear relevant env vars
    delete process.env.PORT;
    delete process.env.DB_HOST;
    delete process.env.DB_SSL;
    delete process.env.OTEL_SERVICE_NAME;
    delete process.env.LOG_LEVEL;
    
    // We still need JWT_SECRET as it doesn't have a default
    process.env.JWT_SECRET = 'a'.repeat(32);
    // And JAEGER_ENDPOINT as it has no default
    process.env.JAEGER_ENDPOINT = 'http://localhost:14268';

    const { config } = require('./index');
    expect(config.port).toBe(3001);
    expect(config.database.host).toBe('localhost');
  });

  it('should use provided values', () => {
    process.env.PORT = '4000';
    process.env.JWT_SECRET = 'b'.repeat(32);
    process.env.JAEGER_ENDPOINT = 'http://localhost:14268';
    
    const { config } = require('./index');
    expect(config.port).toBe(4000);
  });
});
