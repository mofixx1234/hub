import { Link } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { api } from '../api/client';
import { KpiCard } from '../components/KpiCard.jsx';

export function MonStats() {
  const [donnees, setDonnees] = useState(null);
  const [erreur, setErreur] = useState('');

  const charger = useCallback(async () => {
    setErreur('');
    try {
      const { data } = await api.get('/api/stats/perso');
      setDonnees(data);
    } catch (e) {
      setErreur(e.response?.data?.erreur || e.message || 'Impossible de charger vos statistiques.');
    }
  }, []);

  useEffect(() => {
    charger();
  }, [charger]);

  async function testerJournalExport() {
    try {
      await api.post('/api/stats/perso/log-export', { format: 'pdf', app_name: 'hub' });
      await charger();
    } catch (e) {
      setErreur(e.response?.data?.erreur || e.message);
    }
  }

  const d = donnees?.donnees_saisies;

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <Link to="/tableau-de-bord" className="text-sm font-medium text-sky-700 hover:underline">
          ← Tableau de bord
        </Link>
        <h1 className="mt-6 text-2xl font-bold text-slate-900">Mes statistiques</h1>
        <p className="mt-2 text-sm text-slate-600">
          Données personnelles — non visibles par les autres utilisateurs.
        </p>

        {erreur && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {erreur}
          </div>
        )}

        {donnees && (
          <>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <KpiCard titre="Connexions ce mois" valeur={String(donnees.logins_ce_mois)} />
              <KpiCard
                titre="Temps estimé (sessions)"
                valeur={`≈ ${donnees.temps_total_estime_min} min`}
                sousTitre="Basé sur connexions × durée moyenne estimée"
              />
            </div>

            <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
              <h2 className="text-sm font-semibold text-slate-800">Application la plus utilisée</h2>
              <p className="mt-2 text-lg font-medium text-slate-900">
                {donnees.app_la_plus_utilisee?.label || '—'}
              </p>
            </div>

            <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
              <h2 className="text-sm font-semibold text-slate-800">Données saisies</h2>
              <ul className="mt-3 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
                <li>Joueurs : {d?.joueurs ?? 0}</li>
                <li>Matchs : {d?.matchs ?? 0}</li>
                <li>Lignes stats : {d?.lignes_stats_match ?? 0}</li>
                <li>Élèves EPS : {d?.eps_eleves ?? 0}</li>
                <li>Lignes BAC EPS : {d?.eps_bac_lignes ?? 0}</li>
                <li>Notations classe : {d?.eps_classe_notations ?? 0}</li>
              </ul>
            </div>

            <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
              <h2 className="text-sm font-semibold text-slate-800">Exports</h2>
              <p className="mt-2 text-slate-700">
                Exports enregistrés ce mois :{' '}
                <strong>{donnees.exports_effectues ?? 0}</strong>
              </p>
              <button
                type="button"
                onClick={testerJournalExport}
                className="mt-3 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
              >
                Journaliser un export test (PDF)
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
