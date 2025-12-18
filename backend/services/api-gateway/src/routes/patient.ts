import { Router, Request, Response } from 'express';
import { patientServiceClient } from '../clients/serviceClient';

const router = Router();

// Proxy patient registration to patient service  
router.post('/', async (req: Request, res: Response) => {
  try {
    const result = await patientServiceClient.post('/api/patients', req.body, {
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
        error: { code: 'SERVICE_UNAVAILABLE', message: 'Patient service is unavailable' },
      });
    }
  }
});

// Get patient profile
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const result = await patientServiceClient.get(`/api/patients/${req.params.id}`, {
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
        error: { code: 'SERVICE_UNAVAILABLE', message: 'Patient service is unavailable' },
      });
    }
  }
});

export default router;
