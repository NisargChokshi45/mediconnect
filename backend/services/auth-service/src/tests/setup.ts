import 'reflect-metadata';

process.env.JWT_SECRET = 'your-super-secret-jwt-key-change-in-production-min-32-chars';
process.env.JAEGER_ENDPOINT = 'http://localhost:14268/api/traces';
process.env.OTEL_SERVICE_NAME = 'auth-service-test';
