import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/auth/AuthProvider';

export default function ProtectedRoute() {
  const { user, role } = useAuth();
  return user && role === 'admin' ? <Outlet /> : <Navigate to="/login" replace />;
}

export function UserProtectedRoute() {
  const { user, role } = useAuth();
  return user && role === 'tenant' ? <Outlet /> : <Navigate to="/login" replace />;
}