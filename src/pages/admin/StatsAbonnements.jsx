import { useCallback, useEffect, useState } from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { api } from '../../api/client';
import { KpiCard } from '../../components/KpiCard.jsx';
import { AdminStatsNav } from './AdminStatsNav.jsx';

const COULEURS = ['#ff6b35', '#0369a1', '#22c55e', '#a855f7', '#eab308'];

export function StatsAbonnements() {
  const [donnees, setDonnees] = useState(null);
  const [erreur, setErreur] = useState('');

  const charger = useCallback(async () => {
    setErreur('');
    try {
      const { data } = await api.get('/api/stats/admin/abonnements');
      setDonnees(data);
    } catch (e) {
      setErreur(e.response?.data?.erreur || e.message || 'Chargement impossible.');
    }
  }, []);

  useEffect(() => {
    charger();
  }, [charger]);

  const rubriqueData = donnees?.abonnements_actifs_par_rubrique ?? [];

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-2xl font-bold text-slate-900">Analytics — Abonnements</h1>
        <p className="mt-2 text-sm text-slate-600">Répartition par rubrique (actifs, date fin ≥ aujourd’hui).</p>

        <AdminStatsNav />

        {erreur && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {erreur}
          </div>
        )}

        {donnees && (
          <>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <KpiCard titre="Churn % (30 j)" valeur={`${donnees.churn_pct_30j} %`} />
              <KpiCard titre="Renouvellement % (30 j)" valeur={`${donnees.renewal_pct_30j} %`} />
            </div>

            <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-800">Abonnements actifs par rubrique</h2>
              <div className="mx-auto mt-4 h-80 max-w-md">
                {rubriqueData.length === 0 ? (
                  <p className="text-sm text-slate-500">Aucun abonnement actif.</p>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={rubriqueData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={56}
                        outerRadius={88}
                        paddingAngle={2}
                      >
                        {rubriqueData.map((_, i) => (
                          <Cell key={i} fill={COULEURS[i % COULEURS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v) => [`${v} actifs`, '']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
