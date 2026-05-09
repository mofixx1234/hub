import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../api/client';

export function ReinitialiserMotDePasse() {
  const [params] = useSearchParams();
  const tokenFromUrl = params.get('token') || '';
  const navigate = useNavigate();

  const [token, setToken] = useState(tokenFromUrl);
  const [motDePasse, setMotDePasse] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);

  async function soumettre(e) {
    e.preventDefault();
    setErreur('');
    if (motDePasse !== confirmation) {
      setErreur('Les mots de passe ne correspondent pas.');
      return;
    }
    setChargement(true);
    try {
      await api.post('/api/auth/mot-de-passe/confirmer', {
        token: token.trim(),
        mot_de_passe: motDePasse,
      });
      navigate('/connexion', { replace: true });
    } catch (err) {
      setErreur(err.response?.data?.erreur || err.message || 'Lien invalide ou expiré.');
    } finally {
      setChargement(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
      <Link to="/connexion" className="text-sm font-medium text-sky-700 hover:underline">
        ← Connexion
      </Link>
      <h1 className="mt-6 text-2xl font-bold text-slate-900">Nouveau mot de passe</h1>
      <form onSubmit={soumettre} className="mt-8 space-y-4">
        {erreur && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            {erreur}
          </div>
        )}
        {!tokenFromUrl && (
          <div>
            <label className="block text-sm text-slate-700">Jeton reçu par e-mail</label>
            <textarea
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-xs"
              rows={3}
            />
          </div>
        )}
        <div>
          <label className="block text-sm text-slate-700">Nouveau mot de passe (min. 8)</label>
          <input
            type="password"
            required
            minLength={8}
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm text-slate-700">Confirmation</label>
          <input
            type="password"
            required
            minLength={8}
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>
        <button
          type="submit"
          disabled={chargement}
          className="w-full rounded-xl bg-orange-500 py-3 font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
        >
          {chargement ? 'Enregistrement…' : 'Enregistrer'}
        </button>
      </form>
    </div>
  );
}
