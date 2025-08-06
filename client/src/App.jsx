import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Register from './pages/Register';
import Login from './pages/Login';
import ProtectedRoute, { UserProtectedRoute } from './auth/ProtectedRoute';
import { AuthProvider } from './auth/AuthProvider';
import { Toaster } from 'sonner';

import Home from './pages/Home';
import Tenants from './pages/Tenants';
import Rooms from './pages/Rooms';
import Profile from './pages/Profile';

import UserLayout from './layouts/UserLayout';
import UserHome from './pages/UserHome';
import UserProfile from './pages/UserProfile';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-dvh w-full overflow-x-hidden">
        <Routes>
          {/* Auth-free public route */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          <Route element={<UserProtectedRoute />}>
            <Route element={<UserLayout />}>
              <Route path="/user" element={<UserHome />} />
              <Route path="/user-profile" element={<UserProfile />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="tenants" element={<Tenants />} />
              <Route path="rooms" element={<Rooms />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Route>
        </Routes>
        </div>
      </Router>
      <Toaster position="top-center" richColors />
    </AuthProvider>
  );
}
