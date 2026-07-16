export function getHealth(_request, response) {
  response.status(200).json({ status: 'ok', service: 'nourishpath-api', timestamp: new Date().toISOString() });
}
