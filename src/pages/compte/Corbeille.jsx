import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import { CompteSubnav } from './CompteSubnav.jsx';

export function Corbeille() {
  const [elements, setElements] = useState([]);
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');

  const charger = useCallback(async () => {
    setErr('');
    try {
      const { data } = await api.get('/api/profil/corbeille');
      setElements(data.elements || []);
    } catch (e) {
      setErr(e.response?.data?.erreur || e.message || 'Chargement impossible.');
    }
  }, []);

  useEffect(() => {
    charger();
  }, [charger]);

  async function restaurer(type, id) {
    setErr('');
    setMsg('');
    try {
      await api.post(`/api/profil/corbeille/${encodeURIComponent(type)}/${encodeURIComponent(id)}/restaurer`);
      setMsg('Élément restauré.');
      await charger();
    } catch (e) {
      setErr(e.response?.data?.erreur || e.message);
    }
  }

  async function vider() {
    if (!window.confirm('Supprimer définitivement tout le contenu de la corbeille ?')) return;
    setErr('');
    setMsg('');
    try {
      await api.post('/api/profil/corbeille/vider');
      setMsg('Corbeille vidée.');
      await charger();
    } catch (e) {
      setErr(e.response?.data?.erreur || e.message);
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
        <h1 className="mt-6 text-2xl font-bold text-slate-900 dark:text-white">Corbeille</h1>
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

        {elements.length === 0 && !err && (
          <p className="mt-10 text-center text-slate-600 dark:text-slate-400">
            Votre corbeille est vide ✅
          </p>
        )}

        <ul className="mt-8 space-y-3">
          {elements.map((el) => (
            <li
              key={`${el.categorie}-${el.id}`}
              className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium text-slate-900 dark:text-white">
                  🗑️ {el.libelle}
                  {el.sous_titre ? (
                    <span className="block text-sm font-normal text-slate-600 dark:text-slate-400">
                      {el.sous_titre}
                    </span>
                  ) : null}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Supprimé il y a {el.supprime_il_y_a_jours} j · Expire dans {el.expire_dans_jours} j
                </p>
              </div>
              <button
                type="button"
                onClick={() => restaurer(el.categorie, el.id)}
                className="shrink-0 rounded-lg border border-sky-600 px-3 py-1.5 text-sm font-medium text-sky-700 hover:bg-sky-50 dark:text-sky-400 dark:hover:bg-sky-950/50"
              >
                Restaurer
              </button>
            </li>
          ))}
        </ul>

        {elements.length > 0 && (
          <button
            type="button"
            onClick={vider}
            className="mt-8 w-full rounded-xl border border-red-300 bg-red-50 py-3 text-sm font-semibold text-red-800 hover:bg-red-100 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"
          >
            🗑️ Vider la corbeille
          </button>
        )}
      </div>
    </div>
  );
}
