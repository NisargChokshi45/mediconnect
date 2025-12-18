import { Request, Response, NextFunction } from 'express';
import { createLogger } from '../../../../shared/logger';

const logger = createLogger('appointment-service');

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
  logger.error('Error occurred:', { error: err.message });

  if (err.message === 'APPOINTMENT_NOT_FOUND') {
    return res.status(404).json({
      success: false,
      error: { code: 'APPOINTMENT_NOT_FOUND', message: 'Appointment not found' },
    });
  }

  if (err.message === 'PATIENT_NOT_FOUND' || err.message === 'DOCTOR_NOT_FOUND') {
    return res.status(404).json({
      success: false,
      error: { code: err.message, message: 'Referenced entity not found' },
    });
  }

  return res.status(500).json({
    success: false,
    error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' },
  });
}
