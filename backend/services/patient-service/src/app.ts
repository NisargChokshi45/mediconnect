import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import patientRoutes from './routes/patient';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'healthy', service: 'patient-service' });
});

// Routes
app.use('/api/patients', patientRoutes);

// Error handling
app.use(errorHandler);

export default app;
