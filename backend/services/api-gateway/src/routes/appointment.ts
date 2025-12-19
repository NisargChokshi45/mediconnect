import { Router, Request, Response } from 'express';
import { appointmentServiceClient } from '../clients/serviceClient';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const result = await appointmentServiceClient.post('/api/appointments', req.body, {
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
        error: { code: 'SERVICE_UNAVAILABLE', message: 'Appointment service is unavailable' },
      });
    }
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const result = await appointmentServiceClient.get(`/api/appointments/${req.params.id}`, {
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
        error: { code: 'SERVICE_UNAVAILABLE', message: 'Appointment service is unavailable' },
      });
    }
  }
});

router.get('/patient/:patientId/upcoming', async (req: Request, res: Response) => {
  try {
    const result = await appointmentServiceClient.get(
      `/api/appointments/patient/${req.params.patientId}/upcoming`,
      {
        'x-correlation-id': req.headers['x-correlation-id'] as string,
        authorization: req.headers.authorization || '',
      }
    );
    res.status(result.status).json(result.data);
  } catch (error: any) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({
        success: false,
        error: { code: 'SERVICE_UNAVAILABLE', message: 'Appointment service is unavailable' },
      });
    }
  }
});

router.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const result = await appointmentServiceClient.put(
      `/api/appointments/${req.params.id}/status`,
      req.body,
      {
        'x-correlation-id': req.headers['x-correlation-id'] as string,
        authorization: req.headers.authorization || '',
      }
    );
    res.status(result.status).json(result.data);
  } catch (error: any) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({
        success: false,
        error: { code: 'SERVICE_UNAVAILABLE', message: 'Appointment service is unavailable' },
      });
    }
  }
});

export default router;
