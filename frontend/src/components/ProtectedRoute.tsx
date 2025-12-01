import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCenter } from '../contexts/CenterContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireCenter?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireCenter = true 
}) => {
  const { isAuthenticated, loading } = useAuth();
  const { selectedCenter } = useCenter();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-warm-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireCenter && !selectedCenter) {
    return <Navigate to="/center-selection" replace />;
  }

  return <>{children}</>;
};

