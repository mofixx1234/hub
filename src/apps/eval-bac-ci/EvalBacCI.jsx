import { EvaluationEpsBac } from '../../pages/EvaluationEpsBac.jsx';

/** MODULE 18 — Évaluation BAC programme ivoirien (barèmes MENA-CI via config globale). */
export function EvalBacCI() {
  return (
    <EvaluationEpsBac
      apiPrefix="/api/apps/eps/ci"
      titrePrincipal="Évaluation BAC — 🇨🇮 Programme Ivoirien"
      sousTitre="Calcul selon les barèmes officiels stockés sur la plateforme (modifiables par l’admin central). Précisez le sexe de l’élève pour appliquer la bonne grille."
      accentClass="bg-orange-500"
    />
  );
}
