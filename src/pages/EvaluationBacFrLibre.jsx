import { EvaluationEpsBac } from './EvaluationEpsBac.jsx';

export function EvaluationBacFrLibre() {
  return (
    <EvaluationEpsBac
      apiPrefix="/api/apps/eps/fr-libre"
      titrePrincipal="Évaluation BAC — 📝 Candidat libre"
      sousTitre="Barème générique programme français. Les candidats libres paient sans rattachement à une école."
      accentClass="bg-indigo-600"
    />
  );
}
