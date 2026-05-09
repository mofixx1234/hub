import { useCallback, useEffect, useMemo, useState } from 'react';
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

function joursRestants(dateFin) {
  if (!dateFin) return null;
  return Math.ceil((new Date(dateFin).getTime() - Date.now()) / (24 * 60 * 60 * 1000));
}

function libelleRubrique(a) {
  if (a.rubrique === 'SPORT') return `🏀 SPORT — ${a.sport || 'Sport'}`;
  if (a.rubrique === 'ENSEIGNEMENT_CI') return '📚 Enseignement ivoirien';
  if (a.rubrique === 'ENSEIGNEMENT_FR') return '📚 Jules Verne';
  return a.rubrique || 'Abonnement';
}

export function Abonnements() {
  const [abonnements, setAbonnements] = useState([]);
  const [err, setErr] = useState('');

  const charger = useCallback(async () => {
    setErr('');
    try {
      const { data } = await api.get('/api/mon-hub/abonnements');
      setAbonnements(data.abonnements || []);
    } catch (e) {
      setErr(e.response?.data?.erreur || e.message || 'Chargement impossible.');
    }
  }, []);

  useEffect(() => {
    charger();
  }, [charger]);

  const appsById = useMemo(() => {
    const m = new Map();
    for (const a of abonnements) {
      for (const ap of a.applications || []) {
        m.set(ap.id, ap.nom || ap.code || ap.id);
      }
    }
    return m;
  }, [abonnements]);

  const actifs = abonnements.filter((a) => a.statut === 'actif');
  const expires = abonnements.filter((a) => a.statut !== 'actif');

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <Link
          to="/tableau-de-bord"
          className="text-sm font-medium text-sky-700 hover:underline dark:text-sky-400"
        >
          ← Tableau de bord
        </Link>
        <h1 className="mt-6 text-2xl font-bold text-slate-900 dark:text-white">Mes abonnements</h1>
        <div className="mt-6">
          <CompteSubnav />
        </div>

        {err && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/50 dark:text-red-200">
            {err}
          </div>
        )}

        <div className="mt-6">
          <Link
            to="/choisir-abonnement"
            className="inline-flex rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
          >
            + Ajouter un abonnement
          </Link>
        </div>

        <h2 className="mt-10 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Actifs
        </h2>
        <ul className="mt-4 space-y-4">
          {actifs.map((a) => {
            const j = joursRestants(a.date_fin);
            const ids = a.apps_incluses_ids || [];
            return (
              <li
                key={a.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900"
              >
                <p className="font-semibold text-slate-900 dark:text-white">{libelleRubrique(a)}</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  Formule : {a.type_abonnement === 'formule' ? 'Club' : 'À la carte'} ·{' '}
                  {Number(a.montant_paye || 0).toLocaleString('fr-FR')} FCFA
                </p>
                <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                  Actif depuis : {formatDate(a.date_debut)}
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  Expire le : {formatDate(a.date_fin)}
                  {j !== null && j >= 0 ? ` (dans ${j} jours)` : ''}
                </p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Apps :{' '}
                  {ids.length
                    ? ids
                        .map((id) => {
                          const nom = appsById.get(id);
                          return nom ? `${nom} ✅` : '✅';
                        })
                        .join(' · ')
                    : '—'}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    to="/choisir-abonnement"
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800"
                  >
                    Renouveler
                  </Link>
                  <Link
                    to="/choisir-abonnement"
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800"
                  >
                    Modifier
                  </Link>
                  <span className="rounded-lg border border-dashed border-slate-300 px-3 py-1.5 text-xs text-slate-500 dark:border-slate-600">
                    Annuler (support)
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
        {actifs.length === 0 && (
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">Aucun abonnement actif.</p>
        )}

        <h2 className="mt-10 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Expirés ou suspendus
        </h2>
        <ul className="mt-4 space-y-3">
          {expires.map((a) => (
            <li
              key={a.id}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/50"
            >
              <p className="font-medium text-slate-800 dark:text-slate-200">{libelleRubrique(a)}</p>
              <p className="text-xs text-slate-500">
                {formatDate(a.date_debut)} — {formatDate(a.date_fin)} · {a.statut}
              </p>
              <Link
                to="/choisir-abonnement"
                className="mt-2 inline-block text-sm font-medium text-sky-700 hover:underline dark:text-sky-400"
              >
                Se réabonner
              </Link>
            </li>
          ))}
        </ul>
        {expires.length === 0 && (
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">Aucun ancien abonnement.</p>
        )}
      </div>
    </div>
  );
}
