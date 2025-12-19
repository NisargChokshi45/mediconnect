import app from './app';
import { config } from './config';
import { createLogger } from '../../../shared/logger';

const logger = createLogger('api-gateway', config.logging.level);

const bootstrap = async () => {
  try {
    // Start server
    const server = app.listen(config.port, () => {
      logger.info(`API Gateway running on port ${config.port}`);
      logger.info(`API Documentation available at http://localhost:${config.port}/api-docs`);
    });

    // Graceful shutdown
    const shutdown = async () => {
      logger.info('Shutting down gracefully...');
      server.close(() => {
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

bootstrap();

export { bootstrap };
