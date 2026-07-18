import app from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { connectDatabase } from './config/database.js';

connectDatabase()
  .then(() => app.listen(env.port, () => logger.info('NourishPath API listening', { port: env.port, environment: env.nodeEnv })))
  .catch((error) => { logger.error('Database connection failed', { error: error.message }); process.exit(1); });
