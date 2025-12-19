import { Router, Request, Response } from 'express';
import { PatientService } from '../services/PatientService';
import { authMiddleware, requireRole, AuthRequest } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { CreatePatientDtoSchema, UpdatePatientDtoSchema } from '../types/dtos';
import { createLogger } from '../utils/logger';

const router = Router();
const patientService = new PatientService();
const logger = createLogger('patient-service');

// Create patient profile
router.post(
  '/',
  authMiddleware,
  requireRole(['PATIENT', 'ADMIN']),
  validateRequest(CreatePatientDtoSchema),
  async (req: AuthRequest, res: Response, next) => {
    try {
      const patient = await patientService.createPatient(req.body);
      logger.info('Patient profile created', { patientId: patient.id });
      res.status(201).json({
        success: true,
        data: patient,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get patient by ID
router.get('/:id', authMiddleware, async (req: Request, res: Response, next) => {
  try {
    const patient = await patientService.getPatientById(req.params.id);
    res.status(200).json({
      success: true,
      data: patient,
    });
  } catch (error) {
    next(error);
  }
});

// Get patient by user ID
router.get('/user/:userId', authMiddleware, async (req: Request, res: Response, next) => {
  try {
    const patient = await patientService.getPatientByUserId(req.params.userId);
    res.status(200).json({
      success: true,
      data: patient,
    });
  } catch (error) {
    next(error);
  }
});

// Update patient
router.put(
  '/:id',
  authMiddleware,
  requireRole(['PATIENT', 'ADMIN']),
  validateRequest(UpdatePatientDtoSchema),
  async (req: Request, res: Response, next) => {
    try {
      const patient = await patientService.updatePatient(req.params.id, req.body);
      logger.info('Patient profile updated', { patientId: patient.id });
      res.status(200).json({
        success: true,
        data: patient,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Delete patient
router.delete(
  '/:id',
  authMiddleware,
  requireRole(['ADMIN']),
  async (req: Request, res: Response, next) => {
    try {
      await patientService.deletePatient(req.params.id);
      logger.info('Patient profile deleted', { patientId: req.params.id });
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

export default router;
