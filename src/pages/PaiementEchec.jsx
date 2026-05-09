import { Link, useSearchParams } from 'react-router-dom';

export function PaiementEchec() {
  const [params] = useSearchParams();
  const ref = params.get('ref');

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6">
      <div className="max-w-md text-center">
        <p className="text-4xl" aria-hidden>
          ✕
        </p>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Paiement non finalisé</h1>
        <p className="mt-3 text-slate-600">
          Vous pouvez réessayer depuis le tableau de bord. Aucun débit ne sera appliqué sans
          validation Wave.
        </p>
        {ref && (
          <p className="mt-2 font-mono text-xs text-slate-500">
            Réf. commande : {ref}
          </p>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/paiement/abonnement"
            className="rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
          >
            Réessayer
          </Link>
          <Link
            to="/tableau-de-bord"
            className="rounded-xl border border-slate-300 px-6 py-3 font-medium text-slate-700 hover:bg-slate-100"
          >
            Tableau de bord
          </Link>
        </div>
      </div>
    </div>
  );
}
