import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';

export function MotDePasseOublie() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [erreur, setErreur] = useState('');
  const [envoi, setEnvoi] = useState(false);

  async function soumettre(e) {
    e.preventDefault();
    setErreur('');
    setMessage('');
    setEnvoi(true);
    try {
      const { data } = await api.post('/api/auth/mot-de-passe/demande', { email: email.trim() });
      setMessage(data.message || 'Demande enregistrée.');
    } catch (err) {
      setErreur(err.response?.data?.erreur || err.message || 'Erreur.');
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
      <Link to="/connexion" className="text-sm font-medium text-sky-700 hover:underline">
        ← Connexion
      </Link>
      <h1 className="mt-6 text-2xl font-bold text-slate-900">Mot de passe oublié</h1>
      <p className="mt-2 text-sm text-slate-600">
        Saisissez votre e-mail : si un compte existe, un lien valide 15 minutes vous sera envoyé.
      </p>
      <form onSubmit={soumettre} className="mt-8 space-y-4">
        {erreur && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            {erreur}
          </div>
        )}
        {message && (
          <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-900">
            {message}
          </div>
        )}
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="vous@exemple.com"
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        />
        <button
          type="submit"
          disabled={envoi}
          className="w-full rounded-xl bg-sky-700 py-3 font-semibold text-white hover:bg-sky-800 disabled:opacity-60"
        >
          {envoi ? 'Envoi…' : 'Envoyer le lien'}
        </button>
      </form>
    </div>
  );
}
