import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import { CompteSubnav } from './CompteSubnav.jsx';

function formatRelatif(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  const s = Math.floor((Date.now() - d.getTime()) / 60000);
  if (s < 2) return 'il y a 2 min';
  if (s < 60) return `il y a ${s} min`;
  const h = Math.floor(s / 60);
  if (h < 48) return `il y a ${h} h`;
  return d.toLocaleDateString('fr-FR');
}

export function MesDonnees() {
  const [resume, setResume] = useState(null);
  const [err, setErr] = useState('');
  const [format, setFormat] = useState('csv');
  const [periode, setPeriode] = useState('mois');
  const [app, setApp] = useState('toutes');
  const [msg, setMsg] = useState('');

  const charger = useCallback(async () => {
    setErr('');
    try {
      const { data } = await api.get('/api/profil/donnees-resume');
      setResume(data);
    } catch (e) {
      setErr(e.response?.data?.erreur || e.message || 'Chargement impossible.');
    }
  }, []);

  useEffect(() => {
    charger();
  }, [charger]);

  async function telecharger() {
    setErr('');
    setMsg('');
    try {
      const res = await api.post(
        '/api/profil/export-donnees',
        { format, periode, app },
        { responseType: format === 'json' ? 'blob' : 'blob' }
      );
      const mime =
        format === 'json'
          ? 'application/json'
          : format === 'csv'
            ? 'text/csv'
            : 'application/octet-stream';
      const blob = new Blob([res.data], { type: mime });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = format === 'json' ? 'hub-export.json' : 'hub-export.csv';
      a.click();
      URL.revokeObjectURL(url);
      setMsg('Téléchargement lancé.');
      await charger();
    } catch (e) {
      if (e.response?.status === 501) {
        setErr(e.response?.data?.erreur || 'Format non disponible.');
      } else {
        setErr(e.response?.data?.erreur || e.message || 'Échec.');
      }
    }
  }

  async function recevoirMaintenant() {
    setErr('');
    setMsg('');
    try {
      const { data } = await api.post('/api/profil/sauvegarde-maintenant');
      setMsg(data.message || 'Demande enregistrée.');
      await charger();
    } catch (e) {
      setErr(e.response?.data?.erreur || e.message);
    }
  }

  const stats = resume?.statistiques;
  const sauv = resume?.sauvegarde_auto;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <Link
          to="/tableau-de-bord"
          className="text-sm font-medium text-sky-700 hover:underline dark:text-sky-400"
        >
          ← Tableau de bord
        </Link>
        <h1 className="mt-6 text-2xl font-bold text-slate-900 dark:text-white">Mes données</h1>
        <div className="mt-6">
          <CompteSubnav />
        </div>

        {err && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/50 dark:text-red-200">
            {err}
          </div>
        )}
        {msg && (
          <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100">
            {msg}
          </div>
        )}

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Stockage
          </h2>
          <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">
            {resume?.stockage?.message ||
              'Vos données sont stockées de manière sécurisée sur nos serveurs. Aucune donnée n’est partagée.'}
          </p>
          {stats && (
            <ul className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
              <li className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">
                Notes d’élèves : <strong>{stats.notes_eleves}</strong> entrées
              </li>
              <li className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">
                Joueurs gérés : <strong>{stats.joueurs_geres}</strong> profils
              </li>
              <li className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">
                Exports effectués : <strong>{stats.exports_effectues}</strong>
              </li>
              <li className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">
                Dernière sauvegarde : {formatRelatif(stats.derniere_sauvegarde_at)}
              </li>
            </ul>
          )}
        </section>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Exporter mes données
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              ['pdf', '📄 PDF'],
              ['excel', '📊 Excel'],
              ['csv', '📋 CSV'],
              ['json', '🔧 JSON'],
            ].map(([v, label]) => (
              <button
                key={v}
                type="button"
                onClick={() => setFormat(v)}
                className={`rounded-lg border px-3 py-1.5 text-sm ${
                  format === v
                    ? 'border-sky-600 bg-sky-50 font-medium dark:bg-sky-900/30'
                    : 'border-slate-200 dark:border-slate-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <p className="mt-4 text-xs text-slate-500">Période</p>
          <div className="mt-1 flex flex-wrap gap-2">
            {[
              ['mois', 'Ce mois'],
              ['6_mois', '6 derniers mois'],
              ['tout', 'Tout'],
            ].map(([v, label]) => (
              <button
                key={v}
                type="button"
                onClick={() => setPeriode(v)}
                className={`rounded-lg border px-3 py-1.5 text-sm ${
                  periode === v
                    ? 'border-sky-600 bg-sky-50 dark:bg-sky-900/30'
                    : 'border-slate-200 dark:border-slate-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <p className="mt-4 text-xs text-slate-500">Application</p>
          <div className="mt-1 flex flex-wrap gap-2">
            {[
              ['toutes', 'Toutes'],
              ['eval_bac', 'Eval BAC'],
              ['gestion', 'Gestion équipe'],
              ['stats', 'Stats'],
            ].map(([v, label]) => (
              <button
                key={v}
                type="button"
                onClick={() => setApp(v)}
                className={`rounded-lg border px-3 py-1.5 text-sm ${
                  app === v
                    ? 'border-sky-600 bg-sky-50 dark:bg-sky-900/30'
                    : 'border-slate-200 dark:border-slate-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={telecharger}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-700"
          >
            ⬇️ Télécharger maintenant
          </button>
        </section>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Sauvegarde automatique
          </h2>
          <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">
            E-mail mensuel :{' '}
            <strong>{sauv?.active ? 'Activé (1er du mois)' : 'Désactivé'}</strong>
          </p>
          {sauv?.prochaine_sauvegarde && (
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Prochaine sauvegarde :{' '}
              {new Date(sauv.prochaine_sauvegarde).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          )}
          <button
            type="button"
            onClick={recevoirMaintenant}
            className="mt-4 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
          >
            Recevoir maintenant
          </button>
        </section>
      </div>
    </div>
  );
}
