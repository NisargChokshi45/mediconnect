/* istanbul ignore file */
import { config as dotenvConfig } from 'dotenv';
import { z } from 'zod';

dotenvConfig();

export const loadConfig = () => {
  const configSchema = z.object({
    env: z.enum(['development', 'production', 'test']).default('development'),
    port: z.coerce.number().default(3001),
    database: z.object({
      host: z.string().default('localhost'),
      port: z.coerce.number().default(5432),
      username: z.string().default('mediconnect'),
      password: z.string().default('mediconnect123'),
      name: z.string().default('mediconnect_auth'),
      ssl: z.coerce.boolean().default(false),
    }),
    jwt: z.object({
      secret: z.string().min(32),
      expiresIn: z.string().default('24h'),
    }),
    auditService: z.object({
      url: z.string().url().optional(),
    }),
    observability: z.object({
      jaegerEndpoint: z.string().url(),
      serviceName: z.string().default('auth-service'),
    }),
    logging: z.object({
      level: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
    }),
  });

  return configSchema.parse({
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
    auditService: {
      url: process.env.AUDIT_SERVICE_URL,
    },
    observability: {
      jaegerEndpoint: process.env.JAEGER_ENDPOINT,
      serviceName: process.env.OTEL_SERVICE_NAME,
    },
    logging: {
      level: process.env.LOG_LEVEL,
    },
  });
}

export const config = loadConfig();
