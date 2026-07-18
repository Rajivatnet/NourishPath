const allowedUsers = new Set(['Guest1', 'Guest2', 'Guest3']);

export function requireDemoUser(request, response, next) {
  const demoUsername = request.header('x-demo-user');
  if (!allowedUsers.has(demoUsername)) return response.status(401).json({ message: 'A valid demo user is required.' });
  request.demoUsername = demoUsername;
  return next();
}
