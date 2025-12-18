import { config as dotenvConfig } from 'dotenv';
import { z } from 'zod';

dotenvConfig();

const configSchema = z.object({
  env: z.enum(['development', 'production', 'test']).default('development'),
  port: z.coerce.number().default(3005),
  database: z.object({
    host: z.string().default('localhost'),
    port: z.coerce.number().default(5436),
    username: z.string().default('mediconnect'),
    password: z.string().default('mediconnect123'),
    name: z.string().default('mediconnect_notes'),
    ssl: z.coerce.boolean().default(false),
  }),
  authService: z.object({
    url: z.string().url(),
  }),
  appointmentService: z.object({
    url: z.string().url(),
  }),
  logging: z.object({
    level: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  }),
});

export const config = configSchema.parse({
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
    ssl: process.env.DB_SSL,
  },
  authService: {
    url: process.env.AUTH_SERVICE_URL,
  },
  appointmentService: {
    url: process.env.APPOINTMENT_SERVICE_URL,
  },
  logging: {
    level: process.env.LOG_LEVEL,
  },
});
