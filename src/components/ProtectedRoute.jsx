import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export function ProtectedRoute({ children }) {
  const { connecte } = useAuth();
  const lieu = useLocation();

  if (!connecte) {
    return <Navigate to="/connexion" replace state={{ depuis: lieu.pathname }} />;
  }

  return children;
}
