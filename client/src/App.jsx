import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';

import Home from './pages/Home';
import Tenants from './pages/Tenants';
import Rooms from './pages/Rooms';
import Register from './pages/Register';
import Login from './pages/Login';
import ProtectedRoute from './auth/ProtectedRoute';
import { AuthProvider } from './auth/AuthProvider';

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
            </Route>
          </Route>
        </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}
