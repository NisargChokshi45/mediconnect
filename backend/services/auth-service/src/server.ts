import 'reflect-metadata';
import app from './app';
import { AppDataSource } from './config/database';
import { config } from './config';
import { createLogger } from '../../../shared/logger';

const logger = createLogger('auth-service', config.logging.level);

const bootstrap = async () => {
  try {
    // Initialize database
    await AppDataSource.initialize();
    logger.info('Database connected successfully');

    // Start server
    const server = app.listen(config.port, () => {
      logger.info(`Auth Service running on port ${config.port}`);
    });

    // Graceful shutdown
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
