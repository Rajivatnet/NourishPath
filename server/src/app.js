import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { env } from './config/env.js';
import { errorMiddleware, notFoundMiddleware } from './middleware/errorMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import mealPlanRoutes from './routes/mealPlanRoutes.js';
import groceryRoutes from './routes/groceryRoutes.js';
import trackingRoutes from './routes/trackingRoutes.js';
import { generateWeeklyPlan } from './controllers/mealPlanController.js';
import { requireDemoUser } from './middleware/demoUserMiddleware.js';

const app = express();
const clientDistPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../client/dist');
app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: env.clientOrigin, methods: ['GET', 'POST', 'PUT', 'DELETE'], optionsSuccessStatus: 204 }));
app.use(express.json({ limit: '10kb' }));
app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: (_request, response) => response.status(429).json({ message: 'Too many requests. Please wait a moment and try again.' }),
}));
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/meal-plans', mealPlanRoutes);
app.post('/api/weekly-plans/generate', requireDemoUser, generateWeeklyPlan);
app.use('/api', groceryRoutes);
app.use('/api', trackingRoutes);
if (env.nodeEnv === 'production') {
  app.use(express.static(clientDistPath));
  app.get('*', (request, response, next) => {
    if (request.path.startsWith('/api/')) return next();
    return response.sendFile(path.join(clientDistPath, 'index.html'));
  });
}
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
