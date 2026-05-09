import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';

/**
 * @param {{ apiPrefix: string; titrePrincipal: string; accentClass?: string }} props
 */
export function EvaluationEpsClasse({
  apiPrefix,
  titrePrincipal,
  accentClass = 'bg-emerald-600',
}) {
  const [eleves, setEleves] = useState([]);
  const [eleveSel, setEleveSel] = useState('');
  const [notations, setNotations] = useState([]);
  const [erreur, setErreur] = useState('');

  const chargerEleves = useCallback(async () => {
    setErreur('');
    const classe = `${apiPrefix}/classe`;
    try {
      const { data } = await api.get(`${classe}/eleves`);
      setEleves(data.eleves ?? []);
    } catch (err) {
      setErreur(err.response?.data?.erreur || err.message || 'Module indisponible.');
    }
  }, [apiPrefix]);

  useEffect(() => {
    chargerEleves();
  }, [chargerEleves]);

  useEffect(() => {
    let ignore = false;
    const classe = `${apiPrefix}/classe`;
    async function load() {
      if (!eleveSel) {
        setNotations([]);
        return;
      }
      try {
        const { data } = await api.get(`${classe}/eleves/${eleveSel}/notations`);
        if (!ignore) setNotations(data.notations ?? []);
      } catch {
        if (!ignore) setNotations([]);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [eleveSel, apiPrefix]);

  async function ajouterEleve(e) {
    e.preventDefault();
    const classe = `${apiPrefix}/classe`;
    const fd = new FormData(e.target);
    try {
      await api.post(`${classe}/eleves`, {
        nom: fd.get('nom'),
        prenom: fd.get('prenom'),
        classe: fd.get('classe') || null,
      });
      e.target.reset();
      await chargerEleves();
    } catch (err) {
      setErreur(err.response?.data?.erreur || err.message);
    }
  }

  async function ajouterNote(e) {
    e.preventDefault();
    const classe = `${apiPrefix}/classe`;
    const fd = new FormData(e.target);
    try {
      await api.post(`${classe}/notations`, {
        eleve_id: eleveSel,
        titre: fd.get('titre'),
        note: Number(fd.get('note')),
        periode: fd.get('periode') || null,
        commentaire: fd.get('commentaire') || null,
      });
      const { data } = await api.get(`${classe}/eleves/${eleveSel}/notations`);
      setNotations(data.notations ?? []);
      e.target.reset();
    } catch (err) {
      setErreur(err.response?.data?.erreur || err.message);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <Link to="/tableau-de-bord" className="text-sm font-medium text-sky-700 hover:underline">
          ← Tableau de bord
        </Link>
        <h1 className="mt-6 text-2xl font-bold text-slate-900">{titrePrincipal}</h1>

        {erreur && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {erreur}
          </div>
        )}

        <form
          onSubmit={ajouterEleve}
          className="mt-8 grid gap-3 rounded-xl border border-slate-200 bg-white p-6 sm:grid-cols-3"
        >
          <input name="nom" required placeholder="Nom" className="rounded border px-3 py-2" />
          <input name="prenom" required placeholder="Prénom" className="rounded border px-3 py-2" />
          <input name="classe" placeholder="Classe" className="rounded border px-3 py-2" />
          <div className="sm:col-span-3">
            <button
              type="submit"
              className={`rounded-lg px-4 py-2 font-semibold text-white ${accentClass}`}
            >
              Ajouter élève
            </button>
          </div>
        </form>

        <div className="mt-10">
          <label className="text-sm font-medium text-slate-700">Élève</label>
          <select
            value={eleveSel}
            onChange={(e) => setEleveSel(e.target.value)}
            className="mt-2 w-full rounded-lg border px-3 py-2"
          >
            <option value="">— Choisir —</option>
            {eleves.map((el) => (
              <option key={el.id} value={el.id}>
                {el.nom} {el.prenom}
              </option>
            ))}
          </select>
        </div>

        {eleveSel && (
          <>
            <form onSubmit={ajouterNote} className="mt-6 space-y-3 rounded-xl border bg-white p-4">
              <input
                name="titre"
                required
                placeholder="Libellé (ex. Basket EPS)"
                className="w-full rounded border px-3 py-2"
              />
              <div className="flex flex-wrap gap-3">
                <input
                  name="note"
                  type="number"
                  step="0.01"
                  min={0}
                  max={20}
                  required
                  placeholder="/20"
                  className="w-28 rounded border px-3 py-2"
                />
                <input
                  name="periode"
                  placeholder="Période / trimestre"
                  className="flex-1 rounded border px-3 py-2"
                />
              </div>
              <textarea
                name="commentaire"
                placeholder="Commentaire"
                className="w-full rounded border px-3 py-2"
                rows={2}
              />
              <button type="submit" className="rounded-lg bg-sky-700 px-4 py-2 font-medium text-white">
                Ajouter notation
              </button>
            </form>

            <ul className="mt-6 space-y-2">
              {notations.map((n) => (
                <li key={n.id} className="rounded-lg border border-slate-200 bg-white px-4 py-3">
                  <span className="font-medium">{n.titre}</span>{' '}
                  <span className="text-sky-800">{n.note}/20</span>
                  {n.periode && <span className="text-sm text-slate-500"> — {n.periode}</span>}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
