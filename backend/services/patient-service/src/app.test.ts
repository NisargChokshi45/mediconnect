import request from 'supertest';
import app from './app';

jest.mock('./routes/patient', () => {
    const express = require('express');
    const router = express.Router();
    router.get('/test', (req: any, res: any) => res.json({ ok: true }));
    return router;
});

describe('Express App (Patient Service)', () => {
  it('should return health status', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'healthy', service: 'patient-service' });
  });

  it('should use patient routes', async () => {
    const response = await request(app).get('/api/patients/test');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: true });
  });
});
