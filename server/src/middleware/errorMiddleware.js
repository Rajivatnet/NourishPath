import { logger } from '../config/logger.js';

export function notFoundMiddleware(request, response) {
  response.status(404).json({ message: `Route not found: ${request.method} ${request.originalUrl}` });
}

export function errorMiddleware(error, _request, response, _next) {
  logger.error('Unhandled request error', { error: error.message });
  response.status(500).json({ message: 'An unexpected error occurred.' });
}
