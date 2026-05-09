import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';

export function GererClasses() {
  const [classes, setClasses] = useState([]);
  const [err, setErr] = useState('');
  const [nom, setNom] = useState('');
  const [niveau, setNiveau] = useState('');
  const [annee, setAnnee] = useState('2025-2026');
  const [saving, setSaving] = useState(false);

  const charger = useCallback(async () => {
    setErr('');
    try {
      const { data } = await api.get('/api/apps/eval-classe/classes');
      setClasses(data.classes || []);
    } catch (e) {
      setErr(e.response?.data?.erreur || e.message);
    }
  }, []);

  useEffect(() => {
    charger();
  }, [charger]);

  async function creer(e) {
    e.preventDefault();
    setSaving(true);
    setErr('');
    try {
      await api.post('/api/apps/eval-classe/classes', {
        nom: nom.trim(),
        niveau: niveau.trim() || null,
        annee_scolaire: annee.trim(),
      });
      setNom('');
      setNiveau('');
      await charger();
    } catch (ex) {
      setErr(ex.response?.data?.erreur || ex.message);
    } finally {
      setSaving(false);
    }
  }

  async function archiver(id) {
    if (!window.confirm('Archiver cette classe ?')) return;
    try {
      await api.delete(`/api/apps/eval-classe/classes/${id}`);
      await charger();
    } catch (ex) {
      setErr(ex.response?.data?.erreur || ex.message);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Gérer les classes</h1>
        <Link to="/apps/eval-classe" className="text-sm font-medium text-sky-700 hover:underline">
          ← Accueil eval classe
        </Link>
      </div>

      {err && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
          {err}
        </div>
      )}

      <form
        onSubmit={creer}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"
      >
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Nouvelle classe
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="text-slate-600 dark:text-slate-400">Nom *</span>
            <input
              required
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Terminale A2"
            />
          </label>
          <label className="block text-sm">
            <span className="text-slate-600 dark:text-slate-400">Niveau</span>
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              value={niveau}
              onChange={(e) => setNiveau(e.target.value)}
              placeholder="Terminale"
            />
          </label>
          <label className="block text-sm sm:col-span-2">
            <span className="text-slate-600 dark:text-slate-400">Année scolaire *</span>
            <input
              required
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              value={annee}
              onChange={(e) => setAnnee(e.target.value)}
            />
          </label>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="mt-4 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          {saving ? 'Création…' : 'Créer'}
        </button>
      </form>

      <ul className="space-y-2">
        {classes.map((c) => (
          <li
            key={c.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900"
          >
            <Link to={`/apps/eval-classe/classe/${c.id}`} className="font-medium text-sky-700 hover:underline dark:text-sky-400">
              {c.nom}
            </Link>
            <span className="text-sm text-slate-500">
              {c.nombre_eleves} élève(s) · {c.annee_scolaire}
            </span>
            <button
              type="button"
              onClick={() => archiver(c.id)}
              className="text-sm text-red-700 hover:underline dark:text-red-400"
            >
              Archiver
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
