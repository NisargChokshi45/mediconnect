import { Router, Request, Response } from 'express';
import { DoctorService } from '../services/DoctorService';
import { authMiddleware, requireRole, AuthRequest } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { CreateDoctorDtoSchema, UpdateDoctorDtoSchema } from '../types/dtos';
import { createLogger } from '../../../../shared/logger';

const router = Router();
const doctorService = new DoctorService();
const logger = createLogger('doctor-service');

router.post(
  '/',
  authMiddleware,
  requireRole(['DOCTOR', 'ADMIN']),
  validateRequest(CreateDoctorDtoSchema),
  async (req: Request, res: Response, next) => {
    try {
      const doctor = await doctorService.createDoctor(req.body);
      logger.info('Doctor profile created', { doctorId: doctor.id });
      res.status(201).json({ success: true, data: doctor });
    } catch (error) {
      next(error);
    }
  }
);

router.get('/:id', authMiddleware, async (req: Request, res: Response, next) => {
  try {
    const doctor = await doctorService.getDoctorById(req.params.id);
    res.status(200).json({ success: true, data: doctor });
  } catch (error) {
    next(error);
  }
});

router.get('/user/:userId', authMiddleware, async (req: Request, res: Response, next) => {
  try {
    const doctor = await doctorService.getDoctorByUserId(req.params.userId);
    res.status(200).json({ success: true, data: doctor });
  } catch (error) {
    next(error);
  }
});

router.get('/specialization/:spec', authMiddleware, async (req: Request, res: Response, next) => {
  try {
    const doctors = await doctorService.getDoctorsBySpecialization(req.params.spec);
    res.status(200).json({ success: true, data: doctors });
  } catch (error) {
    next(error);
  }
});

router.put(
  '/:id',
  authMiddleware,
  requireRole(['DOCTOR', 'ADMIN']),
  validateRequest(UpdateDoctorDtoSchema),
  async (req: Request, res: Response, next) => {
    try {
      const doctor = await doctorService.updateDoctor(req.params.id, req.body);
      logger.info('Doctor profile updated', { doctorId: doctor.id });
      res.status(200).json({ success: true, data: doctor });
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:id', authMiddleware, requireRole(['ADMIN']), async (req: Request, res: Response, next) => {
  try {
    await doctorService.deleteDoctor(req.params.id);
    logger.info('Doctor profile deleted', { doctorId: req.params.id });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
