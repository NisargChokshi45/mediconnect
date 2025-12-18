import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from './index';
import { User } from '../entities/User';
import { Patient } from '../entities/Patient';
import { Doctor } from '../entities/Doctor';
import { Appointment } from '../entities/Appointment';
import { Note } from '../entities/Note';
import { AuditLog } from '../entities/AuditLog';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.name,
  synchronize: config.env === 'development', // Auto-sync in dev, use migrations in prod
  logging: config.env === 'development',
  entities: [User, Patient, Doctor, Appointment, Note, AuditLog],
  migrations: ['src/database/migrations/**/*.ts'],
  subscribers: [],
  ssl: config.database.ssl
    ? {
        rejectUnauthorized: false,
      }
    : false,
});
