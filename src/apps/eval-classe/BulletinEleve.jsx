import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../../api/client';

export function BulletinEleve() {
  const { eleveId } = useParams();
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');

  const charger = useCallback(async () => {
    setErr('');
    try {
      const { data: d } = await api.get(`/api/apps/eval-classe/eleves/${eleveId}/bulletin`);
      setData(d);
    } catch (e) {
      setErr(e.response?.data?.erreur || e.message);
    }
  }, [eleveId]);

  useEffect(() => {
    charger();
  }, [charger]);

  async function telechargerPdf() {
    try {
      const res = await api.get(`/api/apps/eval-classe/eleves/${eleveId}/bulletin.pdf`, {
        responseType: 'blob',
      });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bulletin-${eleveId}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setErr(e.response?.data?.erreur || e.message);
    }
  }

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

  const obsGenerale = '';

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link to="/apps/eval-classe" className="text-sm font-medium text-sky-700 hover:underline">
            ← Accueil
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">Bulletin</h1>
          <p className="mt-1 text-lg font-medium text-slate-800 dark:text-slate-200">
            {data.eleve.prenom} {data.eleve.nom}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {data.classe.nom} · {data.classe.annee_scolaire}
          </p>
        </div>
        <button
          type="button"
          onClick={telechargerPdf}
          className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
        >
          Exporter PDF (aperçu texte)
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <p className="text-xs uppercase tracking-wide text-slate-500">Établissement</p>
        <p className="font-semibold text-slate-900 dark:text-white">Hub EPS — programme ivoirien / Jules Verne</p>
      </div>

      {['T1', 'T2', 'T3'].map((t) => {
        const lignes = data.trimestres[t] || [];
        return (
          <section key={t}>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Trimestre {t}</h2>
            <div className="mt-2 overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800">
                  <tr>
                    <th className="px-3 py-2">Séance</th>
                    <th className="px-3 py-2">Date</th>
                    <th className="px-3 py-2">Note</th>
                    <th className="px-3 py-2">Observation</th>
                  </tr>
                </thead>
                <tbody>
                  {lignes.map((l) => (
                    <tr key={l.seance_id} className="border-t border-slate-100 dark:border-slate-800">
                      <td className="px-3 py-2">{l.titre}</td>
                      <td className="px-3 py-2">{l.date}</td>
                      <td className="px-3 py-2">
                        {l.absent ? 'Absent' : l.note != null ? l.note : '—'}
                      </td>
                      <td className="px-3 py-2">{l.observation || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-sm text-slate-600">
              Moyenne {t} :{' '}
              {data.moyennes[t] != null ? data.moyennes[t].toFixed(2) : '—'}
            </p>
          </section>
        );
      })}

      <p className="text-sm text-slate-600 dark:text-slate-400">
        Moyenne annuelle :{' '}
        <strong>
          {data.moyennes.annuelle != null ? data.moyennes.annuelle.toFixed(2) : '—'}/20
        </strong>{' '}
        — Mention : <strong>{data.mention}</strong>
      </p>

      <label className="block text-sm">
        <span className="font-medium text-slate-700 dark:text-slate-300">
          Observation générale du professeur
        </span>
        <textarea
          readOnly
          className="mt-2 w-full rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-slate-500 dark:border-slate-600 dark:bg-slate-800"
          rows={3}
          value={obsGenerale}
          placeholder="(À brancher sur une sauvegarde serveur ultérieure)"
        />
      </label>

      <div className="h-24 rounded-lg border border-dashed border-slate-300 dark:border-slate-600" aria-hidden>
        <span className="sr-only">Espace signature</span>
      </div>
    </div>
  );
}
