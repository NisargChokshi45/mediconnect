import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import doctorRoutes from './routes/doctor';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'healthy', service: 'doctor-service' });
});

app.use('/api/doctors', doctorRoutes);

app.use(errorHandler);

export default app;
