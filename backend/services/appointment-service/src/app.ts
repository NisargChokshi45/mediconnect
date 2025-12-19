import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import appointmentRoutes from './routes/appointment';
import { errorHandler } from './middleware/errorHandler';

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.get('/health', (_req, res) => {
  return res.json({ status: 'healthy', service: 'appointment-service' });
});
app.use('/api/appointments', appointmentRoutes);
app.use(errorHandler);

export default app;
