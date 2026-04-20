import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthService } from '@/core/services/auth.service';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();

  if (!AuthService.isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
