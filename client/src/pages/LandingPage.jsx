import { useState } from 'react';
import { login } from '../api/apiClient';

const demoUsers = ['Guest1', 'Guest2', 'Guest3'];

export default function LandingPage() {
  const [username, setUsername] = useState('Guest1');
  const [password, setPassword] = useState('ADMIN');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    setStatus('');
    try {
      const result = await login(username, password);
      setStatus(`Welcome, ${result.user.displayName}. Your personalised nutrition plan is coming next.`);
    } catch (error) {
      setStatus(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-leaf-50 text-slate-900">
      <section className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-12">
        <div className="grid w-full gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="mb-4 font-semibold uppercase tracking-[0.24em] text-leaf-700">NourishPath</p>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-6xl">Small food choices. Stronger recovery.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              A simple, supportive guide for building nourishing meals around everyday wellbeing and recovery goals.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {['Personalised meal ideas', 'Practical food guidance', 'Easy shopping links'].map((item) => (
                <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-leaf-500/10" key={item}>{item}</div>
              ))}
            </div>
            <p className="mt-8 max-w-2xl text-sm leading-6 text-slate-500">
              NourishPath provides general educational information, not medical advice. Always follow guidance from a qualified healthcare professional.
            </p>
          </div>

          <form className="rounded-3xl bg-white p-7 shadow-xl shadow-leaf-700/10" onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold">Demo sign in</h2>
            <p className="mt-2 text-slate-600">Choose a guest profile to explore the MVP.</p>
            <label className="mt-6 block text-sm font-medium" htmlFor="username">Guest profile</label>
            <select className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3" id="username" value={username} onChange={(event) => setUsername(event.target.value)}>
              {demoUsers.map((user) => <option key={user}>{user}</option>)}
            </select>
            <label className="mt-5 block text-sm font-medium" htmlFor="password">Password</label>
            <input className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3" id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required />
            <button className="mt-6 w-full rounded-xl bg-leaf-700 px-4 py-3 font-semibold text-white transition hover:bg-leaf-500 disabled:cursor-not-allowed disabled:opacity-60" disabled={isLoading} type="submit">
              {isLoading ? 'Signing in…' : 'Continue'}
            </button>
            {status && <p className="mt-4 text-sm text-slate-700" role="status">{status}</p>}
            <p className="mt-5 text-xs text-slate-500">Demo credentials: Guest1, Guest2, or Guest3 · password: ADMIN</p>
          </form>
        </div>
      </section>
    </main>
  );
}
