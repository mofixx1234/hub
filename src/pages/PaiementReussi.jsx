import { Link, useSearchParams } from 'react-router-dom';

export function PaiementReussi() {
  const [params] = useSearchParams();
  const ref = params.get('ref');

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6">
      <div className="max-w-md text-center">
        <p className="text-4xl" aria-hidden>
          ✓
        </p>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Paiement en cours de confirmation</h1>
        <p className="mt-3 text-slate-600">
          Si vous avez validé sur Wave, votre abonnement apparaît sous peu dans le tableau de bord
          (webhook sécurisé).
        </p>
        {ref && (
          <p className="mt-2 font-mono text-xs text-slate-500">
            Réf. commande : {ref}
          </p>
        )}
        <Link
          to="/tableau-de-bord"
          className="mt-8 inline-block rounded-xl bg-sky-700 px-6 py-3 font-semibold text-white hover:bg-sky-800"
        >
          Retour au tableau de bord
        </Link>
      </div>
    </div>
  );
}
