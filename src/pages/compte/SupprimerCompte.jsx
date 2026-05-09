import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext.jsx';
import { CompteSubnav } from './CompteSubnav.jsx';

export function SupprimerCompte() {
  const { deconnexion } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [mdp, setMdp] = useState('');
  const [err, setErr] = useState('');
  const [charge, setCharge] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErr('');
    setCharge(true);
    try {
      await api.post('/api/profil/compte/supprimer', {
        email: email.trim().toLowerCase(),
        mot_de_passe: mdp,
      });
      await deconnexion();
      nav('/', { replace: true });
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
          Supprimer définitivement mon compte
        </h1>
        <div className="mt-6">
          <CompteSubnav />
        </div>

        <div className="mt-8 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-900 dark:border-red-800 dark:bg-red-950/50 dark:text-red-100">
          <p className="font-semibold">⚠️ Cette action est IRRÉVERSIBLE.</p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>Toutes vos données seront supprimées dans 30 jours.</li>
            <li>Vos abonnements actifs seront suspendus.</li>
            <li>Aucun remboursement ne sera effectué.</li>
          </ul>
        </div>

        {err && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/50 dark:text-red-200">
            {err}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"
        >
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Confirmez votre e-mail
            <input
              type="email"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Mot de passe
            <input
              type="password"
              autoComplete="current-password"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              value={mdp}
              onChange={(e) => setMdp(e.target.value)}
              required
            />
          </label>
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={charge}
              className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
            >
              {charge ? 'Traitement…' : 'Je comprends, supprimer mon compte'}
            </button>
            <Link
              to="/mon-compte/profil"
              className="inline-flex items-center rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              Annuler
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
