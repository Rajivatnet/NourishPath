import AppRoutes from './routes/AppRoutes';
import { Link, useLocation } from 'react-router-dom';
import PlanActions from './pages/PlanActions';

export default function App() {
  const location = useLocation();
  return <>{location.pathname === '/meal-plan' && <PlanActions />}{location.pathname !== '/dashboard' && <Link className="no-print fixed bottom-5 right-5 z-10 rounded-full bg-leaf-700 px-4 py-3 text-sm font-semibold text-white shadow-lg" to="/dashboard">Dashboard</Link>}<AppRoutes /></>;
}
