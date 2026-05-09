import { EvaluationEpsBac } from './EvaluationEpsBac.jsx';

export function EvaluationBacJv() {
  return (
    <EvaluationEpsBac
      apiPrefix="/api/apps/eps/jules-verne"
      titrePrincipal="Évaluation BAC — programme français (Jules Verne)"
      sousTitre="Même logique de points que le barème ivoirien ; libellés d’épreuves en français (bareme_eps_jv.js)."
      accentClass="bg-violet-600"
    />
  );
}
