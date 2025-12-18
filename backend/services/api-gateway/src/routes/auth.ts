import { Router, Request, Response } from 'express';
import { authServiceClient } from '../clients/serviceClient';

const router = Router();

// Proxy registration requests to auth service
router.post('/register', async (req: Request, res: Response) => {
  try {
    const result = await authServiceClient.post('/api/auth/register', req.body, {
      'x-correlation-id': req.headers['x-correlation-id'] as string,
    });
    res.status(result.status).json(result.data);
  } catch (error: any) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({
        success: false,
        error: { code: 'SERVICE_UNAVAILABLE', message: 'Auth service is unavailable' },
      });
    }
  }
});

// Proxy login requests to auth service
router.post('/login', async (req: Request, res: Response) => {
  try {
    const result = await authServiceClient.post('/api/auth/login', req.body, {
      'x-correlation-id': req.headers['x-correlation-id'] as string,
    });
    res.status(result.status).json(result.data);
  } catch (error: any) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({
        success: false,
        error: { code: 'SERVICE_UNAVAILABLE', message: 'Auth service is unavailable' },
      });
    }
  }
});

export default router;
