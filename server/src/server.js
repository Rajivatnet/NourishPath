import app from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';

app.listen(env.port, () => logger.info('NourishPath API listening', { port: env.port, environment: env.nodeEnv }));
