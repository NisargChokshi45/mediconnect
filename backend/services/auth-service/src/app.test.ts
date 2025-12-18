import request from 'supertest';
import app from './app';

jest.mock('./routes/auth', () => {
  const express = require('express');
  const router = express.Router();
  router.get('/test', (req: any, res: any) => res.json({ ok: true }));
  return router;
});

describe('Express App', () => {
  it('should return health status', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'healthy', service: 'auth-service' });
  });

  it('should use auth routes', async () => {
    // Note: the mock above will be used at /api/auth/test
    const response = await request(app).get('/api/auth/test');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: true });
  });
});
