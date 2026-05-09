import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import { CompteSubnav } from './CompteSubnav.jsx';

export function ChangerMotDePasse() {
  const [ancien, setAncien] = useState('');
  const [nouveau, setNouveau] = useState('');
  const [conf, setConf] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [charge, setCharge] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErr('');
    setMsg('');
    if (nouveau.length < 8) {
      setErr('Le nouveau mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    if (nouveau !== conf) {
      setErr('La confirmation ne correspond pas.');
      return;
    }
    setCharge(true);
    try {
      await api.post('/api/profil/mot-de-passe', { ancien, nouveau });
      setMsg('Mot de passe mis à jour.');
      setAncien('');
      setNouveau('');
      setConf('');
    } catch (ex) {
      setErr(ex.response?.data?.erreur || ex.message || 'Échec.');
    } finally {
      setCharge(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <Link
          to="/mon-compte/profil"
          className="text-sm font-medium text-sky-700 hover:underline dark:text-sky-400"
        >
          ← Profil
        </Link>
        <h1 className="mt-6 text-2xl font-bold text-slate-900 dark:text-white">
          Changer le mot de passe
        </h1>
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

        <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Mot de passe actuel
            <input
              type="password"
              autoComplete="current-password"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              value={ancien}
              onChange={(e) => setAncien(e.target.value)}
              required
            />
          </label>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Nouveau mot de passe
            <input
              type="password"
              autoComplete="new-password"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              value={nouveau}
              onChange={(e) => setNouveau(e.target.value)}
              required
            />
          </label>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Confirmer le nouveau mot de passe
            <input
              type="password"
              autoComplete="new-password"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              value={conf}
              onChange={(e) => setConf(e.target.value)}
              required
            />
          </label>
          <button
            type="submit"
            disabled={charge}
            className="rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-60"
          >
            {charge ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </form>
      </div>
    </div>
  );
}
