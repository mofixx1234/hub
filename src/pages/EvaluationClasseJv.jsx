import { Navigate } from 'react-router-dom';

/** Redirige vers le module Évaluation classe EPS unifié (CI + FR). */
export function EvaluationClasseJv() {
  return <Navigate to="/apps/eval-classe" replace />;
}
