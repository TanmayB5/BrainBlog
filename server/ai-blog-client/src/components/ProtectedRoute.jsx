import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, roles = [], requireAuth = true }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute - user:', user, 'isAuthenticated:', isAuthenticated, 'loading:', loading);
  console.log('ProtectedRoute - requireAuth:', requireAuth, 'roles:', roles);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-light-beige rounded-full animate-spin"></div>
            <div className="w-16 h-16 border-4 border-dark-brown border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="text-text-dark font-medium mt-4">Loading...</p>
          <p className="text-text-medium text-sm">Checking authentication</p>
        </div>
      </div>
    );
  }

  // Redirect to register if authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/register" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (roles.length > 0 && (!user || !roles.includes(user.role))) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🚫</span>
          </div>
          <h1 className="text-3xl font-bold text-text-dark mb-4">Access Denied</h1>
          <p className="text-text-medium mb-6">
            You don't have permission to access this page.
            {roles.length > 0 && (
              <span className="block mt-2 text-sm">
                Required role(s): {roles.join(', ')}
              </span>
            )}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => window.history.back()}
              className="bg-dark-brown text-cream px-6 py-3 rounded-lg font-semibold hover:bg-text-dark transition-colors w-full"
            >
              Go Back
            </button>
            <Link
              to="/"
              className="block text-text-medium hover:text-dark-brown transition-colors mt-2"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
