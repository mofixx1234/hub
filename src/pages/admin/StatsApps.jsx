import { useCallback, useEffect, useState } from 'react';
import { api } from '../../api/client';
import { AppUsageChart } from '../../components/charts/AppUsageChart.jsx';
import { AdminStatsNav } from './AdminStatsNav.jsx';

export function StatsApps() {
  const [donnees, setDonnees] = useState(null);
  const [erreur, setErreur] = useState('');

  const charger = useCallback(async () => {
    setErreur('');
    try {
      const { data } = await api.get('/api/stats/admin/apps');
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
        <h1 className="text-2xl font-bold text-slate-900">Analytics — Applications</h1>
        <p className="mt-2 text-sm text-slate-600">
          Sessions applicatives (accès API journalisés sur 90 jours).
        </p>

        <AdminStatsNav />

        {erreur && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {erreur}
          </div>
        )}

        {donnees && (
          <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <AppUsageChart data={donnees.apps_usage} />
          </div>
        )}
      </div>
    </div>
  );
}
