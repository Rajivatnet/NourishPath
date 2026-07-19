import AppRoutes from './routes/AppRoutes';
import { Link, useLocation } from 'react-router-dom';
import PlanActions from './pages/PlanActions';

export default function App() {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  const showQuickNavigation = !isLandingPage && location.pathname !== '/profile';
  return <>{location.pathname === '/meal-plan' && <PlanActions />}{showQuickNavigation && <div className="no-print fixed bottom-5 left-1/2 z-10 flex w-[calc(100%-2.5rem)] -translate-x-1/2 justify-between sm:hidden">{location.pathname !== '/weekly-plan' && <Link className="whitespace-nowrap rounded-full bg-leaf-700 px-4 py-3 text-sm font-semibold text-white shadow-lg" to="/weekly-plan">Weekly plan</Link>}{location.pathname !== '/dashboard' && <Link className="whitespace-nowrap rounded-full bg-leaf-700 px-4 py-3 text-sm font-semibold text-white shadow-lg" to="/dashboard">Dashboard</Link>}</div>}{showQuickNavigation && location.pathname !== '/dashboard' && <Link className="no-print fixed bottom-5 right-5 z-10 hidden rounded-full bg-leaf-700 px-4 py-3 text-sm font-semibold text-white shadow-lg sm:block" to="/dashboard">Dashboard</Link>}{showQuickNavigation && location.pathname !== '/weekly-plan' && <Link className="no-print fixed bottom-5 left-5 z-10 hidden rounded-full bg-leaf-700 px-4 py-3 text-sm font-semibold text-white shadow-lg sm:block" to="/weekly-plan">Weekly plan</Link>}<AppRoutes /></>;
}
