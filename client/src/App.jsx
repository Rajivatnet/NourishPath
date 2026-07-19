import AppRoutes from './routes/AppRoutes';
import { Link, useLocation } from 'react-router-dom';

export default function App() {
  const location = useLocation();
  return <>{location.pathname !== '/dashboard' && <Link className="fixed bottom-5 right-5 z-10 rounded-full bg-leaf-700 px-4 py-3 text-sm font-semibold text-white shadow-lg" to="/dashboard">Dashboard</Link>}{location.pathname !== '/weekly-plan' && <Link className="fixed bottom-5 left-5 z-10 rounded-full bg-white px-4 py-3 text-sm font-semibold text-leaf-700 shadow-lg ring-1 ring-leaf-700/20" to="/weekly-plan">Weekly plan</Link>}<AppRoutes /></>;
}
