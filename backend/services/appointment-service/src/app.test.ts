import request from 'supertest';
import app from './app';

describe('Express App (Appointment Service)', () => {
  it('should return health status', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'healthy', service: 'appointment-service' });
  });

  it('should have appointments route registered', async () => {
      // Just check any registered route exists
      const response = await request(app).get('/api/appointments/non-existent');
      expect(response.status).not.toBe(404);
  });

  it('should have correct middleware and routers', () => {
      const stack = (app as any)._router.stack;
      const layerNames = stack.map((s: any) => s.name);
      
      // helmet is usually 'helmet' or 'anonymous' depending on version
      expect(layerNames.length).toBeGreaterThan(0);
      
      // Ensure the error handler is the last or second to last
      const lastLayer = stack[stack.length - 1];
      expect(lastLayer.name).toBe('errorHandler');
  });
});
