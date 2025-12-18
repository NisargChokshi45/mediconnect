import { DataSource } from 'typeorm';
import { config } from './index';
import { User } from '../entities/User';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.name,
  synchronize: config.env === 'development',
  logging: config.env === 'development',
  entities: [User],
  migrations: ['src/database/migrations/**/*.ts'],
  subscribers: [],
  ssl: config.database.ssl
    ? {
        rejectUnauthorized: false,
      }
    : false,
});
