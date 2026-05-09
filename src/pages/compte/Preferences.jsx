import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import { CompteSubnav } from './CompteSubnav.jsx';

function appliquerThemeLocal(theme) {
  localStorage.setItem('hub_theme', theme);
  const root = document.documentElement;
  if (theme === 'light') root.classList.remove('dark');
  else root.classList.add('dark');
}

export function Preferences() {
  const [prefs, setPrefs] = useState({
    notif_connexion: true,
    notif_expiration: true,
    notif_rapport: true,
    notif_newsletter: false,
    theme: 'dark',
    langue: 'fr',
  });
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');
  const [charge, setCharge] = useState(true);

  const charger = useCallback(async () => {
    setErr('');
    setCharge(true);
    try {
      const { data } = await api.get('/api/profil/preferences');
      setPrefs(data);
      appliquerThemeLocal(data.theme || 'dark');
    } catch (e) {
      setErr(e.response?.data?.erreur || e.message || 'Chargement impossible.');
    } finally {
      setCharge(false);
    }
  }, []);

  useEffect(() => {
    charger();
  }, [charger]);

  function toggle(key) {
    setPrefs((p) => ({ ...p, [key]: !p[key] }));
  }

  async function sauver() {
    setErr('');
    setMsg('');
    try {
      const { data } = await api.patch('/api/profil/preferences', prefs);
      setPrefs(data);
      appliquerThemeLocal(data.theme || 'dark');
      setMsg('Préférences enregistrées.');
    } catch (e) {
      setErr(e.response?.data?.erreur || e.message || 'Échec.');
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <Link
          to="/tableau-de-bord"
          className="text-sm font-medium text-sky-700 hover:underline dark:text-sky-400"
        >
          ← Tableau de bord
        </Link>
        <h1 className="mt-6 text-2xl font-bold text-slate-900 dark:text-white">Préférences</h1>
        <div className="mt-6">
          <CompteSubnav />
        </div>

        {charge && <p className="mt-6 text-slate-600 dark:text-slate-400">Chargement…</p>}
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

        {!charge && (
          <div className="mt-8 space-y-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Notifications e-mail
              </h2>
              <ul className="mt-4 space-y-3">
                {[
                  ['notif_connexion', 'E-mail à chaque nouvelle connexion'],
                  ['notif_expiration', 'Alerte expiration abonnement (J-7)'],
                  ['notif_rapport', 'Rapport mensuel automatique'],
                  ['notif_newsletter', 'Newsletter (optionnel)'],
                ].map(([key, label]) => (
                  <li key={key} className="flex items-center justify-between gap-4">
                    <span className="text-sm text-slate-800 dark:text-slate-200">{label}</span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={prefs[key]}
                      onClick={() => toggle(key)}
                      className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
                        prefs[key] ? 'bg-sky-600' : 'bg-slate-300 dark:bg-slate-600'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
                          prefs[key] ? 'left-5' : 'left-0.5'
                        }`}
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Affichage
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Thème</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setPrefs((p) => ({ ...p, theme: 'dark' }))}
                  className={`rounded-xl border px-4 py-2 text-sm font-medium ${
                    prefs.theme === 'dark'
                      ? 'border-sky-600 bg-sky-50 text-sky-900 dark:bg-sky-900/30 dark:text-sky-100'
                      : 'border-slate-200 dark:border-slate-600'
                  }`}
                >
                  🌙 Sombre
                </button>
                <button
                  type="button"
                  onClick={() => setPrefs((p) => ({ ...p, theme: 'light' }))}
                  className={`rounded-xl border px-4 py-2 text-sm font-medium ${
                    prefs.theme === 'light'
                      ? 'border-sky-600 bg-sky-50 text-sky-900 dark:bg-sky-900/30 dark:text-sky-100'
                      : 'border-slate-200 dark:border-slate-600'
                  }`}
                >
                  ☀️ Clair
                </button>
              </div>
              <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">Langue</p>
              <p className="mt-1 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm dark:border-slate-600 dark:bg-slate-800">
                Français 🇫🇷
              </p>
            </section>

            <button
              type="button"
              onClick={sauver}
              className="rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-700"
            >
              Enregistrer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
