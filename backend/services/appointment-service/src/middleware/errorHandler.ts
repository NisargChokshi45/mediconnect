
import { Request, Response, NextFunction } from 'express';
import { createLogger } from '../../../../shared/logger';
const logger = createLogger('appointment-service');
export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
  logger.error('Error occurred:', { error: err.message });
  switch (err.message) {
    case 'APPOINTMENT_NOT_FOUND':
      return res.status(404).json({
        success: false,
        error: { code: 'APPOINTMENT_NOT_FOUND', message: 'Appointment not found' },
      });
    case 'PATIENT_NOT_FOUND':
    case 'DOCTOR_NOT_FOUND':
      return res.status(404).json({
        success: false,
        error: { code: err.message, message: 'Referenced entity not found' },
      });
    default:
      return res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' },
      });
  }
}
