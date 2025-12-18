import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import noteRoutes from './routes/note';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'healthy', service: 'notes-service' });
});

app.use('/api/notes', noteRoutes);

app.use(errorHandler);

export default app;
