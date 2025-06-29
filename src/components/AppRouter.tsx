import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { storage } from '../utils/storage';

interface AppRouterProps {
  children: React.ReactNode;
}

const AppRouter: React.FC<AppRouterProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication state on app load
    const checkAuth = () => {
      const authenticated = storage.isAuthenticated();
      setIsAuthenticated(authenticated);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // If user is authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // If not authenticated, show the intended route (welcome, login, signup)
  return <>{children}</>;
};

export default AppRouter; 