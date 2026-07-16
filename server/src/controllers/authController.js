const demoUsers = new Map([
  ['guest1', { username: 'Guest1', displayName: 'Guest 1' }],
  ['guest2', { username: 'Guest2', displayName: 'Guest 2' }],
  ['guest3', { username: 'Guest3', displayName: 'Guest 3' }],
]);

export function login(request, response) {
  const { username, password } = request.body ?? {};
  const user = typeof username === 'string' ? demoUsers.get(username.toLowerCase()) : null;
  if (!user || password !== 'ADMIN') return response.status(401).json({ message: 'Invalid demo username or password.' });
  return response.status(200).json({ user, demo: true });
}
