import 'reflect-metadata';
import app from './app';
import { AppDataSource } from './config/database';
import { config } from './config';
import { createLogger } from './utils/logger';

const logger = createLogger('appointment-service', config.logging.level);

const bootstrap = async () => {
  try {
    await AppDataSource.initialize();
    logger.info('Database connected successfully');

    const server = app.listen(config.port, () => {
      logger.info(`Appointment Service running on port ${config.port}`);
    });

    const shutdown = async () => {
      logger.info('Shutting down gracefully...');
      server.close(async () => {
        await AppDataSource.destroy();
        logger.info('Server closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

bootstrap();

export { bootstrap };
