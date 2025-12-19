import { Request, Response, NextFunction } from 'express';
import { createLogger } from '../../../../shared/logger';
import { config } from '../config';
const logger = createLogger('auth-service', config.logging.level);
export class AppError extends Error {
  constructor(public code: string, message: string, public statusCode: number = 500) {
    super(message);
    this.name = 'AppError';
  }
}
export const errorHandler = (err: any, req: Request, res: Response, _next: NextFunction) => {
  logger.error('Error occurred:', { error: err.message, stack: err.stack });
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: { code: err.code, message: err.message },
    });
  }
  switch (err.message) {
    case 'USER_ALREADY_EXISTS':
      return res.status(409).json({
        success: false,
        error: { code: 'USER_ALREADY_EXISTS', message: 'A user with this email already exists' },
      });
    case 'INVALID_CREDENTIALS':
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' },
      });
    case 'USER_INACTIVE':
      return res.status(403).json({
        success: false,
        error: { code: 'USER_INACTIVE', message: 'This account has been deactivated' },
      });
    case 'INVALID_TOKEN':
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_TOKEN', message: 'Invalid or expired token' },
      });
    default:
      return res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' },
      });
  }
}
