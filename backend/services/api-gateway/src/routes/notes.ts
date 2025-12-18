import { Router, Request, Response } from 'express';
import { notesServiceClient } from '../clients/serviceClient';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const result = await notesServiceClient.post('/api/notes', req.body, {
      'x-correlation-id': req.headers['x-correlation-id'] as string,
      authorization: req.headers.authorization || '',
    });
    res.status(result.status).json(result.data);
  } catch (error: any) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({
        success: false,
        error: { code: 'SERVICE_UNAVAILABLE', message: 'Notes service is unavailable' },
      });
    }
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const result = await notesServiceClient.get(`/api/notes/${req.params.id}`, {
      'x-correlation-id': req.headers['x-correlation-id'] as string,
      authorization: req.headers.authorization || '',
    });
    res.status(result.status).json(result.data);
  } catch (error: any) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({
        success: false,
        error: { code: 'SERVICE_UNAVAILABLE', message: 'Notes service is unavailable' },
      });
    }
  }
});

router.get('/appointment/:appointmentId', async (req: Request, res: Response) => {
  try {
    const result = await notesServiceClient.get(`/api/notes/appointment/${req.params.appointmentId}`, {
      'x-correlation-id': req.headers['x-correlation-id'] as string,
      authorization: req.headers.authorization || '',
    });
    res.status(result.status).json(result.data);
  } catch (error: any) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({
        success: false,
        error: { code: 'SERVICE_UNAVAILABLE', message: 'Notes service is unavailable' },
      });
    }
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const result = await notesServiceClient.put(`/api/notes/${req.params.id}`, req.body, {
      'x-correlation-id': req.headers['x-correlation-id'] as string,
      authorization: req.headers.authorization || '',
    });
    res.status(result.status).json(result.data);
  } catch (error: any) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({
        success: false,
        error: { code: 'SERVICE_UNAVAILABLE', message: 'Notes service is unavailable' },
      });
    }
  }
});

export default router;
