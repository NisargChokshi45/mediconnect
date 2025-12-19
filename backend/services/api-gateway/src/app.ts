import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { correlationIdMiddleware } from './middleware/correlation';
import { createLogger } from './utils/logger';
import { config } from './config';
import authRoutes from './routes/auth';
import patientRoutes from './routes/patient';
import doctorRoutes from './routes/doctor';
import appointmentRoutes from './routes/appointment';
import notesRoutes from './routes/notes';
import { openApiSpec } from './docs/openapi';

const logger = createLogger('api-gateway', config.logging.level);

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(correlationIdMiddleware);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'healthy', service: 'api-gateway' });
});

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));

// Routes - proxy to microservices
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/notes', notesRoutes);
// Add more routes as services are implemented

// Error handling
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error('Gateway error:', { error: err.message });
  res.status(500).json({
    success: false,
    error: {
      code: 'GATEWAY_ERROR',
      message: 'An error occurred while processing your request',
    },
  });
});

export default app;
