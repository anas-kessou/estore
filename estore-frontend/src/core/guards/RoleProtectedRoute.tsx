import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthService } from '@/core/services/auth.service';

interface RoleProtectedRouteProps {
  children: ReactNode;
  roles: string[];
}

export const RoleProtectedRoute = ({ children, roles }: RoleProtectedRouteProps) => {
  const location = useLocation();

  if (!AuthService.isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const user = AuthService.getCurrentUser();
  const userRole = user?.role;

  if (!userRole || !roles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
