import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import { CompteSubnav } from './CompteSubnav.jsx';

function formatDate(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return '—';
  }
}

export function Paiements() {
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [filtre, setFiltre] = useState('tous');
  const [err, setErr] = useState('');

  const charger = useCallback(async () => {
    setErr('');
    try {
      const { data: d } = await api.get('/api/profil/paiements', {
        params: { page, filtre },
      });
      setData(d);
    } catch (e) {
      setErr(e.response?.data?.erreur || e.message || 'Chargement impossible.');
    }
  }, [page, filtre]);

  useEffect(() => {
    charger();
  }, [charger]);

  async function facture(id) {
    try {
      const res = await api.get(`/api/profil/paiements/${id}/facture`, { responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `facture-${id}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setErr(e.response?.data?.erreur || e.message || 'Téléchargement impossible.');
    }
  }

  const paiements = data?.paiements || [];
  const pag = data?.pagination;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/tableau-de-bord"
          className="text-sm font-medium text-sky-700 hover:underline dark:text-sky-400"
        >
          ← Tableau de bord
        </Link>
        <h1 className="mt-6 text-2xl font-bold text-slate-900 dark:text-white">
          Historique des paiements
        </h1>
        <div className="mt-6">
          <CompteSubnav />
        </div>

        {err && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/50 dark:text-red-200">
            {err}
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-2">
          {[
            ['tous', 'Tous'],
            ['payes', 'Payés'],
            ['echoues', 'Échoués'],
          ].map(([v, label]) => (
            <button
              key={v}
              type="button"
              onClick={() => {
                setPage(1);
                setFiltre(v);
              }}
              className={`rounded-lg border px-3 py-1.5 text-sm ${
                filtre === v
                  ? 'border-sky-600 bg-sky-50 dark:bg-sky-900/30'
                  : 'border-slate-200 dark:border-slate-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
              <tr>
                <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-200">Date</th>
                <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-200">
                  Description
                </th>
                <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-200">Montant</th>
                <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-200">Statut</th>
                <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paiements.map((p) => (
                <tr key={p.id} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="px-4 py-3 text-slate-800 dark:text-slate-200">{formatDate(p.date)}</td>
                  <td className="px-4 py-3 text-slate-800 dark:text-slate-200">{p.description}</td>
                  <td className="px-4 py-3 text-slate-800 dark:text-slate-200">
                    {p.montant_fcfa.toLocaleString('fr-FR')} FCFA
                  </td>
                  <td className="px-4 py-3">
                    {p.statut === 'paye' && '✅ Payé'}
                    {p.statut === 'echoue' && '❌ Échoué'}
                    {p.statut === 'en_attente' && '⏳ En attente'}
                  </td>
                  <td className="px-4 py-3">
                    {p.statut === 'paye' && (
                      <button
                        type="button"
                        onClick={() => facture(p.id)}
                        className="text-sky-700 underline hover:no-underline dark:text-sky-400"
                      >
                        Facture
                      </button>
                    )}
                    {p.statut === 'echoue' && (
                      <Link
                        to="/choisir-abonnement"
                        className="text-sky-700 underline hover:no-underline dark:text-sky-400"
                      >
                        Réessayer
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pag && pag.pages > 1 && (
          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded border border-slate-300 px-3 py-1 text-sm disabled:opacity-40 dark:border-slate-600"
            >
              Précédent
            </button>
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Page {pag.page} / {pag.pages}
            </span>
            <button
              type="button"
              disabled={page >= pag.pages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded border border-slate-300 px-3 py-1 text-sm disabled:opacity-40 dark:border-slate-600"
            >
              Suivant
            </button>
          </div>
        )}

        <p className="mt-6 text-sm font-medium text-slate-700 dark:text-slate-300">
          Total payé ce mois :{' '}
          <span className="text-slate-900 dark:text-white">
            {(data?.total_paye_mois_fcfa ?? 0).toLocaleString('fr-FR')} FCFA
          </span>
        </p>
      </div>
    </div>
  );
}
