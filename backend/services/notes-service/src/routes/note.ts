import { Router, Request, Response } from 'express';
import { NoteService } from '../services/NoteService';
import { authMiddleware, requireRole, AuthRequest } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { CreateNoteDtoSchema, UpdateNoteDtoSchema } from '../types/dtos';
import { createLogger } from '../../../../shared/logger';

const router = Router();
const noteService = new NoteService();
const logger = createLogger('notes-service');

router.post(
  '/',
  authMiddleware,
  requireRole(['DOCTOR']),
  validateRequest(CreateNoteDtoSchema),
  async (req: AuthRequest, res: Response, next) => {
    try {
      const note = await noteService.createNote(req.body, req.user!.userId);
      logger.info('Clinical note created', { noteId: note.id });
      res.status(201).json({ success: true, data: note });
    } catch (error) {
      next(error);
    }
  }
);

router.get('/:id', authMiddleware, async (req: Request, res: Response, next) => {
  try {
    const note = await noteService.getNoteById(req.params.id);
    res.status(200).json({ success: true, data: note });
  } catch (error) {
    next(error);
  }
});

router.get(
  '/appointment/:appointmentId',
  authMiddleware,
  async (req: Request, res: Response, next) => {
    try {
      const notes = await noteService.getNotesByAppointmentId(req.params.appointmentId);
      res.status(200).json({ success: true, data: notes });
    } catch (error) {
      next(error);
    }
  }
);

router.get('/doctor/:doctorId', authMiddleware, async (req: Request, res: Response, next) => {
  try {
    const notes = await noteService.getNotesByDoctorId(req.params.doctorId);
    res.status(200).json({ success: true, data: notes });
  } catch (error) {
    next(error);
  }
});

router.put(
  '/:id',
  authMiddleware,
  requireRole(['DOCTOR']),
  validateRequest(UpdateNoteDtoSchema),
  async (req: AuthRequest, res: Response, next) => {
    try {
      const note = await noteService.updateNote(req.params.id, req.body, req.user!.userId);
      logger.info('Clinical note updated', { noteId: note.id });
      res.status(200).json({ success: true, data: note });
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  '/:id',
  authMiddleware,
  requireRole(['DOCTOR']),
  async (req: AuthRequest, res: Response, next) => {
    try {
      await noteService.deleteNote(req.params.id, req.user!.userId);
      logger.info('Clinical note deleted', { noteId: req.params.id });
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

export default router;
