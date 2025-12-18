import request from 'supertest';
import app from './app';

jest.mock('./routes/doctor', () => {
    const express = require('express');
    const router = express.Router();
    router.get('/test', (req: any, res: any) => res.json({ ok: true }));
    return router;
});

describe('Express App (Doctor Service)', () => {
  it('should return health status', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'healthy', service: 'doctor-service' });
  });

  it('should use doctor routes', async () => {
    const response = await request(app).get('/api/doctors/test');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: true });
  });
});
