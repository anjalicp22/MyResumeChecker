import React from 'react';
import { Navigate, Outlet  } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, token } = useAuth();
  const localToken = localStorage.getItem('token');

  if (!user && !token && !localToken) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};



export default ProtectedRoute;
