import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';

import Register from './pages/Register';
import Login from './pages/Login';

import Home from './pages/Home';
import Tenants from './pages/Tenants';
import Rooms from './pages/Rooms';

import Profile from './pages/Profile';
import ProtectedRoute from './auth/ProtectedRoute';
import { AuthProvider } from './auth/AuthProvider';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-dvh w-full overflow-x-hidden">
        <Routes>
          {/* Auth-free public route */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Protected / App routes with layout */}
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
