import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { config } from '../config';

export interface AuthRequest extends Request {
  user?: { userId: string; email: string; role: string };
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        success: false,
        error: { code: 'MISSING_TOKEN', message: 'Authentication token is required' },
      });
    }

    const response = await axios.post(
      `${config.authService.url}/api/auth/verify`,
      {},
      { headers: { authorization: `Bearer ${token}` } }
    );

    if (response.data.success) {
      req.user = response.data.data;
      next();
    } else {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_TOKEN', message: 'Invalid authentication token' },
      });
    }
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: { code: 'AUTH_FAILED', message: 'Authentication failed' },
    });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Insufficient permissions' },
      });
    }
    next();
  };
};
