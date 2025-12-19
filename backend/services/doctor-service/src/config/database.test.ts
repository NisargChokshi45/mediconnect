import { DataSource } from 'typeorm';

describe('Database Config', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('should configure without SSL', () => {
    jest.doMock('./index', () => ({
      config: {
        database: {
          host: 'localhost',
          port: 5432,
          username: 'user',
          password: 'password',
          name: 'db',
          ssl: false,
        },
        env: 'development',
      },
    }));

    const { AppDataSource } = require('./database');
    const options = AppDataSource.options;
    expect(options.ssl).toBe(false);
  });

  it('should configure with SSL', () => {
    jest.doMock('./index', () => ({
      config: {
        database: {
          host: 'localhost',
          port: 5432,
          username: 'user',
          password: 'password',
          name: 'db',
          ssl: true,
        },
        env: 'production',
      },
    }));

    const { AppDataSource } = require('./database');
    const options = AppDataSource.options;
    expect(options.ssl).toEqual({ rejectUnauthorized: false });
  });
});
