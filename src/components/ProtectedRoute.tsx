import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user } = useAuth();

  // Si no hay usuario logueado, redirigimos a /login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, mostramos el componente hijo
  return <>{children}</>;
}