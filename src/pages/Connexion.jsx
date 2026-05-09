import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export function Connexion() {
  const { connexion } = useAuth();
  const navigate = useNavigate();
  const lieu = useLocation();
  const depuis = lieu.state?.depuis || '/tableau-de-bord';

  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState('');

  async function soumettre(e) {
    e.preventDefault();
    setErreur('');
    setChargement(true);
    try {
      await connexion({
        email: email.trim(),
        mot_de_passe: motDePasse,
        device_name: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      });
      navigate(depuis, { replace: true });
    } catch (err) {
      const msg =
        err.response?.data?.erreur ||
        err.response?.data?.message ||
        'Impossible de se connecter. Réessayez.';
      setErreur(msg);
    } finally {
      setChargement(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-12">
        <Link to="/" className="mb-8 text-center text-lg font-semibold text-slate-900">
          ← Hub
        </Link>
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Connexion</h1>
          <p className="mt-2 text-sm text-slate-600">
            Une seule session active : une nouvelle connexion déconnecte l&apos;appareil précédent.
          </p>

          <form onSubmit={soumettre} className="mt-8 space-y-5">
            {erreur && (
              <div
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
                role="alert"
              >
                {erreur}
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
            <div>
              <label htmlFor="mdp" className="block text-sm font-medium text-slate-700">
                Mot de passe
              </label>
              <input
                id="mdp"
                type="password"
                autoComplete="current-password"
                required
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
            <button
              type="submit"
              disabled={chargement}
              className="w-full rounded-xl bg-sky-700 py-3 font-semibold text-white hover:bg-sky-800 disabled:opacity-60"
            >
              {chargement ? 'Connexion…' : 'Se connecter'}
            </button>
          </form>

          <p className="mt-4 text-center text-sm">
            <Link to="/mot-de-passe-oublie" className="font-medium text-sky-700 hover:underline">
              Mot de passe oublié ?
            </Link>
          </p>

          <p className="mt-6 text-center text-sm text-slate-600">
            Pas encore de compte ?{' '}
            <Link to="/inscription" className="font-medium text-sky-700 hover:underline">
              S&apos;inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
