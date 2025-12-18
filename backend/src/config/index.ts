import { config as dotenvConfig } from 'dotenv';
import { z } from 'zod';

dotenvConfig();

const configSchema = z.object({
  env: z.enum(['development', 'production', 'test']).default('development'),
  port: z.coerce.number().default(3000),
  database: z.object({
    host: z.string().default('localhost'),
    port: z.coerce.number().default(5432),
    username: z.string().default('mediconnect'),
    password: z.string().default('mediconnect123'),
    name: z.string().default('mediconnect'),
    ssl: z.coerce.boolean().default(false),
  }),
  jwt: z.object({
    secret: z.string().min(32),
    expiresIn: z.string().default('24h'),
  }),
  insurance: z.object({
    apiUrl: z.string().url(),
    apiKey: z.string(),
  }),
  observability: z.object({
    jaegerEndpoint: z.string().url(),
    serviceName: z.string().default('mediconnect-backend'),
  }),
  logging: z.object({
    level: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  }),
});

const envVars = {
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
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
  insurance: {
    apiUrl: process.env.INSURANCE_API_URL,
    apiKey: process.env.INSURANCE_API_KEY,
  },
  observability: {
    jaegerEndpoint: process.env.JAEGER_ENDPOINT,
    serviceName: process.env.OTEL_SERVICE_NAME,
  },
  logging: {
    level: process.env.LOG_LEVEL,
  },
};

export const config = configSchema.parse(envVars);
