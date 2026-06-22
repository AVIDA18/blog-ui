import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) return <div className="spinner" />;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (adminOnly && !isAdmin) return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;
