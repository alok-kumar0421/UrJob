import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * Protected route for authenticated users
 */
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

/**
 * Admin route - only admin users can access
 */
export const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return isAuthenticated && user?.isAdmin ? children : <Navigate to="/" />;
};
