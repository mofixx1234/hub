import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../../api/client';

export function ListeElevesClasse() {
  const { classeId } = useParams();
  const [detail, setDetail] = useState(null);
  const [eleves, setEleves] = useState([]);
  const [err, setErr] = useState('');
  const charger = useCallback(async () => {
    setErr('');
    try {
      const [d, e] = await Promise.all([
        api.get(`/api/apps/eval-classe/classes/${classeId}`),
        api.get(`/api/apps/eval-classe/classes/${classeId}/eleves`),
      ]);
      setDetail(d.data);
      setEleves(e.data.eleves || []);
    } catch (ex) {
      setErr(ex.response?.data?.erreur || ex.message);
    }
  }, [classeId]);

  useEffect(() => {
    charger();
  }, [charger]);

  if (err) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{err}</div>
    );
  }

  if (!detail) {
    return (
      <div className="flex items-center gap-2 text-slate-600">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-sky-600 border-t-transparent" />
        Chargement…
      </div>
    );
  }

  const s = detail.statistiques;
  const c = detail.classe;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link to="/apps/eval-classe" className="text-sm font-medium text-sky-700 hover:underline">
            ← Retour
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{c.nom}</h1>
          <p className="text-slate-600 dark:text-slate-400">
            {c.niveau || '—'} · {c.annee_scolaire}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to={`/apps/eval-classe/classe/${classeId}/saisie`}
            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Saisir une note
          </Link>
          <Link
            to={`/apps/eval-classe/classe/${classeId}/moyennes`}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          >
            Moyennes
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
          <p className="text-xs uppercase text-slate-500">Moyenne générale</p>
          <p className="text-2xl font-semibold text-slate-900 dark:text-white">
            {s.moyenne_generale != null ? s.moyenne_generale.toFixed(2) : '—'}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
          <p className="text-xs uppercase text-slate-500">Meilleur élève</p>
          <p className="font-medium text-slate-900 dark:text-white">
            {s.meilleur_eleve?.nom || '—'}
          </p>
          {s.meilleur_eleve?.moyenne_annuelle != null && (
            <p className="text-sm text-slate-500">{s.meilleur_eleve.moyenne_annuelle.toFixed(2)}/20</p>
          )}
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
          <p className="text-xs uppercase text-slate-500">En difficulté</p>
          <p className="font-medium text-slate-900 dark:text-white">
            {s.eleve_en_difficulte?.nom || '—'}
          </p>
        </div>
      </div>

      <section>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Élèves ({eleves.length})
        </h2>
        <ul className="mt-4 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white dark:divide-slate-700 dark:border-slate-700 dark:bg-slate-900">
          {eleves.map((el) => (
            <li key={el.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
              <span className="font-medium text-slate-900 dark:text-white">
                {el.prenom} {el.nom}
              </span>
              <div className="flex gap-3 text-sm">
                <Link
                  to={`/apps/eval-classe/eleve/${el.id}/bulletin`}
                  className="text-sky-700 hover:underline dark:text-sky-400"
                >
                  Voir bulletin
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
