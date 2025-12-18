import 'reflect-metadata';

process.env.JWT_SECRET = 'your-super-secret-jwt-key-change-in-production-min-32-chars';
process.env.JAEGER_ENDPOINT = 'http://localhost:14268/api/traces';
process.env.OTEL_SERVICE_NAME = 'notes-service-test';
process.env.AUTH_SERVICE_URL = 'http://localhost:3001';
process.env.APPOINTMENT_SERVICE_URL = 'http://localhost:3004';
