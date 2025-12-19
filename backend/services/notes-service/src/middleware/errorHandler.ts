import { Request, Response, NextFunction } from 'express';
import { createLogger } from '../../../../shared/logger';

const logger = createLogger('notes-service');

export const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
  logger.error('Error occurred:', { error: err.message });

  if (err.message === 'NOTE_NOT_FOUND') {
    return res.status(404).json({
      success: false,
      error: { code: 'NOTE_NOT_FOUND', message: 'Clinical note not found' },
    });
  }

  if (err.message === 'UNAUTHORIZED_DOCTOR') {
    return res.status(403).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED_DOCTOR',
        message: 'Only the doctor who created this note can modify it',
      },
    });
  }

  if (err.message === 'APPOINTMENT_NOT_FOUND') {
    return res.status(404).json({
      success: false,
      error: { code: 'APPOINTMENT_NOT_FOUND', message: 'Appointment not found' },
    });
  }

  return res.status(500).json({
    success: false,
    error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' },
  });
};
