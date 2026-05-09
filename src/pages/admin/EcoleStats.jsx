import { Link } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { api } from '../../api/client';
import { KpiCard } from '../../components/KpiCard.jsx';

export function EcoleStats() {
  const [donnees, setDonnees] = useState(null);
  const [erreur, setErreur] = useState('');

  const charger = useCallback(async () => {
    setErreur('');
    try {
      const { data } = await api.get('/api/stats/ecole');
      setDonnees(data);
    } catch (e) {
      setErreur(e.response?.data?.erreur || e.message || 'Accès refusé ou école non définie.');
    }
  }, []);

  useEffect(() => {
    charger();
  }, [charger]);

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <Link to="/tableau-de-bord" className="text-sm font-medium text-sky-700 hover:underline">
          ← Tableau de bord
        </Link>
        <h1 className="mt-6 text-2xl font-bold text-slate-900">Statistiques école</h1>
        <p className="mt-2 text-sm text-slate-600">
          Vue restreinte aux membres et paiements rattachés à votre établissement.
        </p>

        {erreur && (
          <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {erreur}
          </div>
        )}

        {donnees && (
          <>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <KpiCard titre="Profs / coachs (effectif)" valeur={String(donnees.nb_profs_actifs)} />
              <KpiCard
                titre="Dépenses ce mois (école)"
                valeur={`${Math.round(Number(donnees.total_depense_mois_fcfa)).toLocaleString('fr-CI')} FCFA`}
              />
              <KpiCard
                titre="Taux utilisation (mois)"
                valeur={`${donnees.taux_utilisation_pct} %`}
                sousTitre={`${donnees.profs_connectes_mois} prof(s) avec au moins une connexion`}
              />
            </div>

            {donnees.prof_plus_actif && (
              <div className="mt-8 rounded-xl border border-slate-200 bg-white p-5">
                <h2 className="text-sm font-semibold text-slate-800">Prof le plus actif</h2>
                <p className="mt-2 text-slate-900">
                  {donnees.prof_plus_actif.prenom} {donnees.prof_plus_actif.nom} —{' '}
                  <span className="font-medium">{donnees.prof_plus_actif.logins}</span> connexions
                </p>
              </div>
            )}

            <div className="mt-8 rounded-xl border border-slate-200 bg-white p-5">
              <h2 className="text-sm font-semibold text-slate-800">Sessions par application</h2>
              <ul className="mt-4 divide-y divide-slate-100">
                {(donnees.sessions_par_app || []).map((r) => (
                  <li key={r.app} className="flex justify-between py-2 text-sm">
                    <span className="text-slate-700">{r.app}</span>
                    <span className="font-medium tabular-nums text-slate-900">{r.sessions}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
