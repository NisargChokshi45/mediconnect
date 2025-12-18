import { DataSource } from 'typeorm';
import { config } from './index';
import { Note } from '../entities/Note';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.name,
  synchronize: config.env === 'development',
  logging: config.env === 'development',
  entities: [Note],
  migrations: ['src/database/migrations/**/*.ts'],
  ssl: config.database.ssl ? { rejectUnauthorized: false } : false,
});
