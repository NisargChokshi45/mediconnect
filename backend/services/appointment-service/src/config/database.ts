import { DataSource } from 'typeorm';
import { config } from './index';
import { Appointment } from '../entities/Appointment';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.name,
  synchronize: config.env === 'development',
  logging: config.env === 'development',
  entities: [Appointment],
  migrations: ['src/database/migrations/**/*.ts'],
  ssl: config.database.ssl ? { rejectUnauthorized: false } : false,
});
