import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext.jsx';
import { CompteSubnav } from './CompteSubnav.jsx';

export function Profil() {
  const { rafraichirProfil } = useAuth();
  const [profil, setProfil] = useState(null);
  const [form, setForm] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    ville: '',
    nom_club: '',
    mot_de_passe_actuel: '',
  });
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');
  const [charge, setCharge] = useState(true);
  const [sauve, setSauve] = useState(false);

  const charger = useCallback(async () => {
    setErr('');
    setCharge(true);
    try {
      const { data } = await api.get('/api/profil');
      setProfil(data.profil);
      setForm((f) => ({
        ...f,
        prenom: data.profil.prenom,
        nom: data.profil.nom,
        email: data.profil.email,
        telephone: data.profil.telephone || '',
        ville: data.profil.ville || '',
        nom_club: data.profil.nom_club || '',
      }));
    } catch (e) {
      setErr(e.response?.data?.erreur || e.message || 'Chargement impossible.');
    } finally {
      setCharge(false);
    }
  }, []);

  useEffect(() => {
    charger();
  }, [charger]);

  async function handlePhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setErr('');
    const body = new FormData();
    body.append('photo', file);
    try {
      await api.post('/api/profil/avatar', body);
      await charger();
      await rafraichirProfil();
      setMsg('Photo mise à jour.');
    } catch (ex) {
      setErr(ex.response?.data?.erreur || ex.message || 'Envoi impossible.');
    }
    e.target.value = '';
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErr('');
    setMsg('');
    setSauve(true);
    const payload = {
      prenom: form.prenom.trim(),
      nom: form.nom.trim(),
      email: form.email.trim().toLowerCase(),
      telephone: form.telephone || null,
      ville: form.ville || null,
      nom_club: form.nom_club || null,
    };
    if (payload.email !== profil?.email) {
      payload.mot_de_passe_actuel = form.mot_de_passe_actuel;
    }
    try {
      await api.patch('/api/profil', payload);
      setMsg('Profil enregistré.');
      setForm((f) => ({ ...f, mot_de_passe_actuel: '' }));
      await charger();
      await rafraichirProfil();
    } catch (ex) {
      setErr(ex.response?.data?.erreur || ex.message || 'Échec de l’enregistrement.');
    } finally {
      setSauve(false);
    }
  }

  const type = profil?.type_utilisateur;
  const photoSrc = profil?.photo_url
    ? `${import.meta.env.VITE_API_URL?.trim() || ''}${profil.photo_url}`
    : null;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <Link
          to="/tableau-de-bord"
          className="text-sm font-medium text-sky-700 hover:underline dark:text-sky-400"
        >
          ← Tableau de bord
        </Link>
        <h1 className="mt-6 text-2xl font-bold text-slate-900 dark:text-white">Mon compte</h1>
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

        {profil && (
          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"
          >
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Photo de profil</p>
              <div className="mt-2 flex flex-wrap items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100 dark:border-slate-600 dark:bg-slate-800">
                  {photoSrc ? (
                    <img src={photoSrc} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-2xl text-slate-400">👤</span>
                  )}
                </div>
                <label className="cursor-pointer rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700">
                  Choisir une image
                  <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handlePhoto} />
                </label>
              </div>
              <p className="mt-1 text-xs text-slate-500">JPEG, PNG ou WebP — max. 2 Mo. Recadrage manuel à prévoir.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Prénom
                <input
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                  value={form.prenom}
                  onChange={(e) => setForm({ ...form, prenom: e.target.value })}
                  required
                />
              </label>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Nom
                <input
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                  value={form.nom}
                  onChange={(e) => setForm({ ...form, nom: e.target.value })}
                  required
                />
              </label>
            </div>

            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              E-mail
              <input
                type="email"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </label>

            {form.email !== profil.email && (
              <label className="block text-sm font-medium text-amber-800 dark:text-amber-200">
                Mot de passe actuel (requis pour changer l’e-mail)
                <input
                  type="password"
                  autoComplete="current-password"
                  className="mt-1 w-full rounded-lg border border-amber-300 px-3 py-2 dark:border-amber-700 dark:bg-slate-800 dark:text-white"
                  value={form.mot_de_passe_actuel}
                  onChange={(e) => setForm({ ...form, mot_de_passe_actuel: e.target.value })}
                />
              </label>
            )}

            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Téléphone (optionnel)
              <input
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                value={form.telephone}
                onChange={(e) => setForm({ ...form, telephone: e.target.value })}
              />
            </label>

            {type === 'entraineur' && (
              <>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Ville
                  <input
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                    value={form.ville}
                    onChange={(e) => setForm({ ...form, ville: e.target.value })}
                  />
                </label>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Club
                  <input
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                    value={form.nom_club}
                    onChange={(e) => setForm({ ...form, nom_club: e.target.value })}
                  />
                </label>
              </>
            )}

            {(type === 'prof_eps' || type === 'admin_ecole') && (
              <>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Ville
                  <input
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                    value={form.ville}
                    onChange={(e) => setForm({ ...form, ville: e.target.value })}
                  />
                </label>
                {profil.ecole && (
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-600 dark:bg-slate-800">
                    <span className="font-medium text-slate-700 dark:text-slate-200">École : </span>
                    {profil.ecole.nom}
                  </div>
                )}
              </>
            )}

            <button
              type="submit"
              disabled={sauve}
              className="rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-60"
            >
              {sauve ? 'Sauvegarde…' : 'Sauvegarder'}
            </button>
          </form>
        )}

        {profil && (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50/80 p-6 dark:border-red-900 dark:bg-red-950/30">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-red-800 dark:text-red-200">
              Zone sensible
            </h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link
                  to="/mon-compte/mot-de-passe"
                  className="font-medium text-sky-700 underline hover:no-underline dark:text-sky-400"
                >
                  Changer le mot de passe
                </Link>
              </li>
              <li>
                <Link
                  to="/mon-compte/supprimer"
                  className="font-medium text-red-700 underline hover:no-underline dark:text-red-400"
                >
                  Supprimer mon compte
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
