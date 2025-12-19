import { Request, Response, NextFunction } from 'express';
import { createLogger } from '../../../../shared/logger';

const logger = createLogger('doctor-service');

export const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
  logger.error('Error occurred:', { error: err.message });

  if (err.message === 'DOCTOR_ALREADY_EXISTS') {
    return res.status(409).json({
      success: false,
      error: { code: 'DOCTOR_ALREADY_EXISTS', message: 'A doctor profile already exists for this user' },
    });
  }

  if (err.message === 'DOCTOR_NOT_FOUND') {
    return res.status(404).json({
      success: false,
      error: { code: 'DOCTOR_NOT_FOUND', message: 'Doctor not found' },
    });
  }

  return res.status(500).json({
    success: false,
    error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' },
  });
}
