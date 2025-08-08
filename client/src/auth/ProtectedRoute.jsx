import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/auth/AuthProvider';
import LoaderLu from '@/components/shared/LoaderLu';

export default function ProtectedRoute() {
  const { user, role, loading } = useAuth();
  if (loading) {
    return <LoaderLu />;
  }
  return user && role === 'admin' ? <Outlet /> : <Navigate to="/login" replace />;
}

export function UserProtectedRoute() {
  const { user, role, loading } = useAuth();
  if (loading) {
    return <LoaderLu />;
  }
  return user && role === 'tenant' ? <Outlet /> : <Navigate to="/login" replace />;
}