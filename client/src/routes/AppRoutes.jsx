import { Route, Routes } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import NotFoundPage from '../pages/NotFoundPage';
import ProfilePage from '../pages/ProfilePage';
import MealPlanPage from '../pages/MealPlanPage';
import GroceryListPage from '../pages/GroceryListPage';
import DashboardPage from '../pages/DashboardPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/meal-plan" element={<MealPlanPage />} />
      <Route path="/grocery-list" element={<GroceryListPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
