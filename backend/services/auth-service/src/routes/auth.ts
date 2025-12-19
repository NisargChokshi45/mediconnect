import { Router, Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { validateRequest } from '../middleware/validation';
import { LoginDtoSchema, RegisterDtoSchema } from '../types/dtos';
import { createLogger } from '../utils/logger';

const router = Router();
const authService = new AuthService();
const logger = createLogger('auth-service');

// Register endpoint
router.post(
  '/register',
  validateRequest(RegisterDtoSchema),
  async (req: Request, res: Response, next) => {
    try {
      const result = await authService.register(req.body);
      logger.info('User registered successfully', { userId: result.user.id });
      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Login endpoint
router.post(
  '/login',
  validateRequest(LoginDtoSchema),
  async (req: Request, res: Response, next) => {
    try {
      const result = await authService.login(req.body);
      logger.info('User logged in successfully', { userId: result.user.id });
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Verify token endpoint (for other services)
router.post('/verify', async (req: Request, res: Response, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      throw new Error('INVALID_TOKEN');
    }

    const decoded = await authService.verifyToken(token);
    res.status(200).json({
      success: true,
      data: decoded,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
