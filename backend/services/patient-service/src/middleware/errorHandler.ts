import { Request, Response, NextFunction } from 'express';
import { createLogger } from '../../../../shared/logger';

const logger = createLogger('patient-service');

export const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
  logger.error('Error occurred:', { error: err.message, stack: err.stack });

  if (err.message === 'PATIENT_ALREADY_EXISTS') {
    return res.status(409).json({
      success: false,
      error: {
        code: 'PATIENT_ALREADY_EXISTS',
        message: 'A patient profile already exists for this user',
      },
    });
  }

  if (err.message === 'PATIENT_NOT_FOUND') {
    return res.status(404).json({
      success: false,
      error: {
        code: 'PATIENT_NOT_FOUND',
        message: 'Patient not found',
      },
    });
  }

  if (err.message === 'UPDATE_FAILED') {
    return res.status(500).json({
      success: false,
      error: {
        code: 'UPDATE_FAILED',
        message: 'Failed to update patient',
      },
    });
  }

  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
    },
  });
};
