import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';

export function EvalClasseHome() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');

  const charger = useCallback(async () => {
    setErr('');
    try {
      const { data: d } = await api.get('/api/apps/eval-classe/dashboard');
      setData(d);
    } catch (e) {
      setErr(
        e.response?.data?.erreur ||
          'Abonnement ou accès refusé. Vérifiez votre abonnement Évaluation classe (CI ou Jules Verne).'
      );
    }
  }, []);

  useEffect(() => {
    charger();
  }, [charger]);

  if (err) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
        {err}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-sky-600 border-t-transparent" />
        Chargement…
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Évaluation classe EPS</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Contrôle continu — notes tout au long de l&apos;année (programme ivoirien ou Jules Verne).
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          to="/apps/eval-classe/classes"
          className="inline-flex rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          + Créer une classe
        </Link>
      </div>

      {(data.alertes?.seances_sans_notes_ce_mois ?? 0) > 0 && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100">
          <strong>Alerte :</strong> {data.alertes.seances_sans_notes_ce_mois} séance(s) ce mois-ci sans
          aucune note saisie.
        </div>
      )}

      {data.prochaine_seance && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Prochaine séance
          </h2>
          <p className="mt-2 font-medium text-slate-900 dark:text-white">
            {data.prochaine_seance.titre}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {new Date(data.prochaine_seance.date_seance).toLocaleDateString('fr-FR')} ·{' '}
            {data.prochaine_seance.classe?.nom} ({data.prochaine_seance.trimestre})
          </p>
        </div>
      )}

      <section>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Mes classes</h2>
        <ul className="mt-4 space-y-3">
          {(data.classes || []).length === 0 && (
            <li className="text-sm text-slate-500">Aucune classe pour le moment.</li>
          )}
          {(data.classes || []).map((c) => (
            <li key={c.id}>
              <Link
                to={`/apps/eval-classe/classe/${c.id}`}
                className="flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-sky-300 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-sky-700 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{c.nom}</p>
                  <p className="text-sm text-slate-500">
                    {c.niveau || '—'} · {c.annee_scolaire}
                  </p>
                </div>
                <div className="mt-2 text-sm text-slate-600 dark:text-slate-400 sm:mt-0">
                  {c.nombre_eleves} élève(s)
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
