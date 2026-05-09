import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export function Inscription() {
  const { inscription } = useAuth();
  const navigate = useNavigate();

  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [typeUtilisateur, setTypeUtilisateur] = useState('entraineur');
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState('');

  async function soumettre(e) {
    e.preventDefault();
    setErreur('');
    setChargement(true);
    try {
      await inscription({
        prenom: prenom.trim(),
        nom: nom.trim(),
        email: email.trim(),
        mot_de_passe: motDePasse,
        type_utilisateur: typeUtilisateur,
        device_name: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      });
      navigate('/tableau-de-bord', { replace: true });
    } catch (err) {
      const msg =
        err.response?.data?.erreur ||
        err.response?.data?.message ||
        'Inscription impossible. Réessayez.';
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
          <h1 className="text-2xl font-bold text-slate-900">Créer un compte</h1>
          <p className="mt-2 text-sm text-slate-600">
            Choisissez votre profil : entraîneur ou professeur d&apos;EPS.
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
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="prenom" className="block text-sm font-medium text-slate-700">
                  Prénom
                </label>
                <input
                  id="prenom"
                  required
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>
              <div>
                <label htmlFor="nom" className="block text-sm font-medium text-slate-700">
                  Nom
                </label>
                <input
                  id="nom"
                  required
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>
            </div>
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
              <label htmlFor="profil" className="block text-sm font-medium text-slate-700">
                Profil
              </label>
              <select
                id="profil"
                value={typeUtilisateur}
                onChange={(e) => setTypeUtilisateur(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                <option value="entraineur">Entraîneur / Club / Sport</option>
                <option value="prof_eps">Professeur d&apos;EPS</option>
              </select>
            </div>
            <div>
              <label htmlFor="mdp" className="block text-sm font-medium text-slate-700">
                Mot de passe (min. 8 caractères)
              </label>
              <input
                id="mdp"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
            <button
              type="submit"
              disabled={chargement}
              className="w-full rounded-xl bg-orange-500 py-3 font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
            >
              {chargement ? 'Création…' : 'Créer mon compte'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Déjà inscrit ?{' '}
            <Link to="/connexion" className="font-medium text-sky-700 hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
