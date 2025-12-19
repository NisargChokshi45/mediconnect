
import { config } from './index';

describe('Config', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        jest.resetModules();
        process.env = { ...originalEnv };
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    it('should load default configuration', () => {
        process.env.NODE_ENV = 'development';
        process.env.AUTH_SERVICE_URL = 'http://auth:3000';
        process.env.APPOINTMENT_SERVICE_URL = 'http://appointment:3000';
        
        const { config } = require('./index');

        expect(config.port).toBe(3005);
        expect(config.env).toBe('development');
        expect(config.database.host).toBe('localhost');
    });

    it('should load configuration from environment variables', () => {
        process.env.NODE_ENV = 'production';
        process.env.PORT = '4000';
        process.env.DB_HOST = 'db-host';
        process.env.DB_PORT = '5432';
        process.env.DB_USERNAME = 'user';
        process.env.DB_PASSWORD = 'pass';
        process.env.DB_NAME = 'name';
        process.env.DB_SSL = 'true';
        process.env.AUTH_SERVICE_URL = 'http://auth-prod';
        process.env.APPOINTMENT_SERVICE_URL = 'http://appointment-prod';

        const { config } = require('./index');

        expect(config.port).toBe(4000);
        expect(config.env).toBe('production');
        expect(config.database.host).toBe('db-host');
        expect(config.database.ssl).toBe(true);
    });
});
