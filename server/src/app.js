import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { env } from './config/env.js';
import { errorMiddleware, notFoundMiddleware } from './middleware/errorMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import mealPlanRoutes from './routes/mealPlanRoutes.js';

const app = express();
app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: env.clientOrigin, methods: ['GET', 'POST', 'PUT'], optionsSuccessStatus: 204 }));
app.use(express.json({ limit: '10kb' }));
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 100, standardHeaders: 'draft-8', legacyHeaders: false }));
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/meal-plans', mealPlanRoutes);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
