import 'reflect-metadata';

process.env.JWT_SECRET = 'your-super-secret-jwt-key-change-in-production-min-32-chars';
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '5432';
process.env.DB_USERNAME = 'postgres';
process.env.DB_PASSWORD = 'password';
process.env.DB_NAME = 'mediconnect_patients_test';
process.env.AUTH_SERVICE_URL = 'http://localhost:3001';
process.env.JAEGER_ENDPOINT = 'http://localhost:14268/api/traces';
process.env.OTEL_SERVICE_NAME = 'patient-service-test';
