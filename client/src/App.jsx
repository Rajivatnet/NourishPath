import AppRoutes from './routes/AppRoutes';
import { Link, useLocation } from 'react-router-dom';
import PlanActions from './pages/PlanActions';

export default function App() {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  return <>{location.pathname === '/meal-plan' && <PlanActions />}{!isLandingPage && location.pathname !== '/dashboard' && <Link className="no-print fixed bottom-5 right-5 z-10 rounded-full bg-leaf-700 px-4 py-3 text-sm font-semibold text-white shadow-lg" to="/dashboard">Dashboard</Link>}{!isLandingPage && location.pathname !== '/weekly-plan' && <Link className="no-print fixed bottom-5 left-5 z-10 rounded-full bg-white px-4 py-3 text-sm font-semibold text-leaf-700 shadow-lg ring-1 ring-leaf-700/20" to="/weekly-plan">Weekly plan</Link>}<AppRoutes /></>;
}
