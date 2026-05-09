import { Navigate } from 'react-router-dom';

/** Ancienne URL — redirige vers le parcours guidé (module 13). */
export function PaiementAbonnement() {
  return <Navigate to="/choisir-abonnement" replace />;
}
