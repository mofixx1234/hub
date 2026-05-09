import { useCallback, useEffect, useState } from 'react';
import { api } from '../../api/client';
import { KpiCard } from '../../components/KpiCard.jsx';
import { UsersChart } from '../../components/charts/UsersChart.jsx';
import { AdminStatsNav } from './AdminStatsNav.jsx';

export function StatsUtilisateurs() {
  const [donnees, setDonnees] = useState(null);
  const [erreur, setErreur] = useState('');

  const charger = useCallback(async () => {
    setErreur('');
    try {
      const { data } = await api.get('/api/stats/admin/utilisateurs');
      setDonnees(data);
    } catch (e) {
      setErreur(e.response?.data?.erreur || e.message || 'Chargement impossible.');
    }
  }, []);

  useEffect(() => {
    charger();
  }, [charger]);

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-2xl font-bold text-slate-900">Analytics — Utilisateurs</h1>
        <p className="mt-2 text-sm text-slate-600">Inscriptions et mouvements d’abonnements expirés.</p>

        <AdminStatsNav />

        {erreur && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {erreur}
          </div>
        )}

        {donnees && (
          <>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <KpiCard
                titre="Nouveaux (7 j)"
                valeur={String(donnees.nouveaux_utilisateurs_7j)}
              />
              <KpiCard titre="Churn % (30 j)" valeur={`${donnees.churn_pct_30j} %`} />
              <KpiCard titre="Renouvellement % (30 j)" valeur={`${donnees.renewal_pct_30j} %`} />
            </div>

            <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-800">Par semaine</h2>
              <div className="mt-4">
                <UsersChart data={donnees.utilisateurs_par_semaine} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
