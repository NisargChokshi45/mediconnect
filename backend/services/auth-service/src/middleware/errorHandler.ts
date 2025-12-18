import { Request, Response, NextFunction } from 'express';
import { createLogger } from '../../../../shared/logger';

const logger = createLogger('auth-service');

export class AppError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
  logger.error('Error occurred:', { error: err.message, stack: err.stack });

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
      },
    });
  }

  // Handle specific error types
  if (err.message === 'USER_ALREADY_EXISTS') {
    return res.status(409).json({
      success: false,
      error: {
        code: 'USER_ALREADY_EXISTS',
        message: 'A user with this email already exists',
      },
    });
  }

  if (err.message === 'INVALID_CREDENTIALS') {
    return res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password',
      },
    });
  }

  if (err.message === 'USER_INACTIVE') {
    return res.status(403).json({
      success: false,
      error: {
        code: 'USER_INACTIVE',
        message: 'This account has been deactivated',
      },
    });
  }

  if (err.message === 'INVALID_TOKEN') {
    return res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid or expired token',
      },
    });
  }

  // Generic error
  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
    },
  });
}
