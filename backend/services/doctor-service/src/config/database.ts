import { DataSource } from 'typeorm';
import { config } from './index';
import { Doctor } from '../entities/Doctor';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.name,
  synchronize: config.env === 'development',
  logging: config.env === 'development',
  entities: [Doctor],
  migrations: ['src/database/migrations/**/*.ts'],
  ssl: config.database.ssl ? { rejectUnauthorized: false } : false,
});
