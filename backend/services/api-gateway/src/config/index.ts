import { config as dotenvConfig } from 'dotenv';
import { z } from 'zod';

dotenvConfig();

const configSchema = z.object({
  env: z.enum(['development', 'production', 'test']).default('development'),
  port: z.coerce.number().default(3000),
  services: z.object({
    authService: z.string().url(),
    patientService: z.string().url(),
    doctorService: z.string().url(),
    appointmentService: z.string().url(),
    notesService: z.string().url(),
  }),
  observability: z.object({
    jaegerEndpoint: z.string().url(),
    serviceName: z.string().default('api-gateway'),
  }),
  logging: z.object({
    level: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  }),
});

export const config = configSchema.parse({
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  services: {
    authService: process.env.AUTH_SERVICE_URL,
    patientService: process.env.PATIENT_SERVICE_URL,
    doctorService: process.env.DOCTOR_SERVICE_URL,
    appointmentService: process.env.APPOINTMENT_SERVICE_URL,
    notesService: process.env.NOTES_SERVICE_URL,
  },
  observability: {
    jaegerEndpoint: process.env.JAEGER_ENDPOINT,
    serviceName: process.env.OTEL_SERVICE_NAME,
  },
  logging: {
    level: process.env.LOG_LEVEL,
  },
});
