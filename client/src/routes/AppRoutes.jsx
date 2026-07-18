import { Route, Routes } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import NotFoundPage from '../pages/NotFoundPage';
import ProfilePage from '../pages/ProfilePage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
