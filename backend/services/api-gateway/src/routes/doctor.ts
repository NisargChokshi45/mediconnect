import { Router, Request, Response } from 'express';
import { doctorServiceClient } from '../clients/serviceClient';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const result = await doctorServiceClient.post('/api/doctors', req.body, {
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
        error: { code: 'SERVICE_UNAVAILABLE', message: 'Doctor service is unavailable' },
      });
    }
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const result = await doctorServiceClient.get(`/api/doctors/${req.params.id}`, {
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
        error: { code: 'SERVICE_UNAVAILABLE', message: 'Doctor service is unavailable' },
      });
    }
  }
});

router.get('/specialization/:spec', async (req: Request, res: Response) => {
  try {
    const result = await doctorServiceClient.get(`/api/doctors/specialization/${req.params.spec}`, {
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
        error: { code: 'SERVICE_UNAVAILABLE', message: 'Doctor service is unavailable' },
      });
    }
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const result = await doctorServiceClient.put(`/api/doctors/${req.params.id}`, req.body, {
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
        error: { code: 'SERVICE_UNAVAILABLE', message: 'Doctor service is unavailable' },
      });
    }
  }
});

export default router;
