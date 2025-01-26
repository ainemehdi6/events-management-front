import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export const AuthLayout: React.FC = () => {
  const { isAuthenticated, checkAuth, logout } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated && !checkAuth()) {
      logout();
    }
  }, [isAuthenticated, checkAuth, logout]);

  if (!isAuthenticated) {
    const currentPath = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${currentPath}`} replace />;
  }

  return <Outlet />;
};