import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../../api/client';

export function MoyennesClasse() {
  const { classeId } = useParams();
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');

  const charger = useCallback(async () => {
    setErr('');
    try {
      const { data: d } = await api.get(`/api/apps/eval-classe/classes/${classeId}/moyennes`);
      setData(d);
    } catch (e) {
      setErr(e.response?.data?.erreur || e.message);
    }
  }, [classeId]);

  useEffect(() => {
    charger();
  }, [charger]);

  if (err) {
    return <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{err}</div>;
  }

  if (!data) {
    return (
      <div className="flex items-center gap-2 text-slate-600">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-sky-600 border-t-transparent" />
        Chargement…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          to={`/apps/eval-classe/classe/${classeId}`}
          className="text-sm font-medium text-sky-700 hover:underline"
        >
          ← Classe
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">Moyennes de classe</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Moyenne pondérée par coefficients par trimestre ; moyenne annuelle = moyenne des trimestres
          renseignés.
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
            <tr>
              <th className="px-3 py-2">Élève</th>
              <th className="px-3 py-2">T1</th>
              <th className="px-3 py-2">T2</th>
              <th className="px-3 py-2">T3</th>
              <th className="px-3 py-2">Moyenne</th>
              <th className="px-3 py-2">Mention</th>
            </tr>
          </thead>
          <tbody>
            {data.moyennes.map((row) => (
              <tr key={row.eleve_id} className="border-b border-slate-100 dark:border-slate-800">
                <td className="px-3 py-2 font-medium text-slate-900 dark:text-white">{row.nom}</td>
                <td className="px-3 py-2">{row.T1 != null ? row.T1.toFixed(2) : '—'}</td>
                <td className="px-3 py-2">{row.T2 != null ? row.T2.toFixed(2) : '—'}</td>
                <td className="px-3 py-2">{row.T3 != null ? row.T3.toFixed(2) : '—'}</td>
                <td className="px-3 py-2 font-semibold">
                  {row.moyenne_annuelle != null ? `${row.moyenne_annuelle.toFixed(2)}/20` : '—'}
                </td>
                <td className="px-3 py-2">{row.mention}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
