import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

/** Route protégée + restriction par `type_utilisateur`. */
export function RoleRoute({ children, types }) {
  const { connecte, utilisateur, pret } = useAuth();
  const lieu = useLocation();

  if (!pret) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-sky-600 border-t-transparent" />
      </div>
    );
  }

  if (!connecte) {
    return <Navigate to="/connexion" replace state={{ depuis: lieu.pathname }} />;
  }

  if (!types.includes(utilisateur?.type_utilisateur)) {
    return <Navigate to="/tableau-de-bord" replace />;
  }

  return children;
}
