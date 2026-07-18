import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from './logger.js';

export async function connectDatabase() {
  if (!env.mongoUri) throw new Error('Missing required environment variable: MONGODB_URI');
  await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 10000 });
  logger.info('MongoDB connected');
}
