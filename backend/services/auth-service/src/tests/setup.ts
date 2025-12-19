import 'reflect-metadata';

process.env.NODE_ENV = 'test';
process.env.PORT = '3001';
process.env.JWT_SECRET = 'your-super-secret-jwt-key-change-in-production-min-32-chars';
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '5432';
process.env.DB_USERNAME = 'postgres';
process.env.DB_PASSWORD = 'password';
process.env.DB_NAME = 'mediconnect_auth_test';
process.env.DB_SSL = 'false';
process.env.JAEGER_ENDPOINT = 'http://localhost:14268/api/traces';
process.env.OTEL_SERVICE_NAME = 'auth-service-test';
process.env.AUDIT_SERVICE_URL = 'http://localhost:3005';
process.env.LOG_LEVEL = 'info';
process.env.JWT_EXPIRES_IN = '24h';
