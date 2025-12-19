import 'reflect-metadata';
import app from './app';
import { AppDataSource } from './config/database';
import { config } from './config';
import { createLogger } from '../../../shared/logger';

const logger = createLogger('patient-service', config.logging.level);

async function bootstrap() {
  try {
    await AppDataSource.initialize();
    logger.info('Database connected successfully');

    const server = app.listen(config.port, () => {
      logger.info(`Patient Service running on port ${config.port}`);
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
}

/* istanbul ignore next */
if (require.main === module) {
  bootstrap();
}

export { bootstrap };
