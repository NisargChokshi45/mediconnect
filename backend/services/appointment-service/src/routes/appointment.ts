import { Router, Request, Response } from 'express';
import { AppointmentService } from '../services/AppointmentService';
import { authMiddleware, requireRole, AuthRequest } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { CreateAppointmentDtoSchema, UpdateAppointmentStatusDtoSchema } from '../types/dtos';
import { createLogger } from '../../../../shared/logger';

const router = Router();
const appointmentService = new AppointmentService();
const logger = createLogger('appointment-service');

router.post(
  '/',
  authMiddleware,
  requireRole(['PATIENT', 'DOCTOR', 'ADMIN']),
  validateRequest(CreateAppointmentDtoSchema),
  async (req: Request, res: Response, next) => {
    try {
      const appointment = await appointmentService.createAppointment(req.body);
      logger.info('Appointment created', { appointmentId: appointment.id });
      res.status(201).json({ success: true, data: appointment });
    } catch (error) {
      next(error);
    }
  }
);

router.get('/:id', authMiddleware, async (req: Request, res: Response, next) => {
  try {
    const appointment = await appointmentService.getAppointmentById(req.params.id);
    res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
});

router.get('/patient/:patientId', authMiddleware, async (req: Request, res: Response, next) => {
  try {
    const appointments = await appointmentService.getPatientAppointments(req.params.patientId);
    res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    next(error);
  }
});

router.get('/doctor/:doctorId', authMiddleware, async (req: Request, res: Response, next) => {
  try {
    const appointments = await appointmentService.getDoctorAppointments(req.params.doctorId);
    res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    next(error);
  }
});

router.get(
  '/patient/:patientId/upcoming',
  authMiddleware,
  async (req: Request, res: Response, next) => {
    try {
      const appointments = await appointmentService.getUpcomingAppointments(req.params.patientId);
      res.status(200).json({ success: true, data: appointments });
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  '/:id/status',
  authMiddleware,
  validateRequest(UpdateAppointmentStatusDtoSchema),
  async (req: Request, res: Response, next) => {
    try {
      const appointment = await appointmentService.updateAppointmentStatus(req.params.id, req.body);
      logger.info('Appointment status updated', {
        appointmentId: appointment.id,
        status: appointment.status,
      });
      res.status(200).json({ success: true, data: appointment });
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  '/:id',
  authMiddleware,
  requireRole(['ADMIN']),
  async (req: Request, res: Response, next) => {
    try {
      await appointmentService.deleteAppointment(req.params.id);
      logger.info('Appointment deleted', { appointmentId: req.params.id });
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/metrics/circuit-breaker',
  authMiddleware,
  requireRole(['ADMIN']),
  async (req: Request, res: Response) => {
    const stats = appointmentService.getInsuranceCircuitBreakerStats();
    res.status(200).json({ success: true, data: stats });
  }
);

export default router;
