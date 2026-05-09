import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';

/**
 * @param {{ apiPrefix: string; titrePrincipal: string; sousTitre?: string; accentClass?: string }} props
 */
export function EvaluationEpsBac({
  apiPrefix,
  titrePrincipal,
  sousTitre,
  accentClass = 'bg-orange-500',
}) {
  const [eleves, setEleves] = useState([]);
  const [epreuves, setEpreuves] = useState([]);
  const [erreur, setErreur] = useState('');
  const [eleveSel, setEleveSel] = useState('');
  const [lignes, setLignes] = useState([]);

  const charger = useCallback(async () => {
    setErreur('');
    const bac = `${apiPrefix}/bac`;
    try {
      const [e, ep] = await Promise.all([api.get(`${bac}/eleves`), api.get(`${bac}/epreuves`)]);
      setEleves(e.data.eleves ?? []);
      setEpreuves(ep.data.epreuves ?? []);
    } catch (err) {
      setErreur(err.response?.data?.erreur || err.message || 'Module indisponible.');
    }
  }, [apiPrefix]);

  useEffect(() => {
    charger();
  }, [charger]);

  useEffect(() => {
    let ignore = false;
    const bac = `${apiPrefix}/bac`;
    async function loadLignes() {
      if (!eleveSel) {
        setLignes([]);
        return;
      }
      try {
        const { data } = await api.get(`${bac}/eleves/${eleveSel}/lignes`);
        if (!ignore) setLignes(data.lignes ?? []);
      } catch {
        if (!ignore) setLignes([]);
      }
    }
    loadLignes();
    return () => {
      ignore = true;
    };
  }, [eleveSel, apiPrefix]);

  async function ajouterEleve(e) {
    e.preventDefault();
    const bac = `${apiPrefix}/bac`;
    const fd = new FormData(e.target);
    try {
      const sexe = fd.get('sexe');
      await api.post(`${bac}/eleves`, {
        nom: fd.get('nom'),
        prenom: fd.get('prenom'),
        classe: fd.get('classe') || null,
        sexe: sexe === 'M' || sexe === 'F' ? sexe : null,
      });
      e.target.reset();
      await charger();
    } catch (err) {
      setErreur(err.response?.data?.erreur || err.message);
    }
  }

  async function ajouterLigne(e) {
    e.preventDefault();
    const bac = `${apiPrefix}/bac`;
    const fd = new FormData(e.target);
    try {
      await api.post(`${bac}/lignes`, {
        eleve_id: eleveSel,
        code_epreuve: fd.get('code_epreuve'),
        valeur_brute: Number(fd.get('valeur')),
      });
      const { data } = await api.get(`${bac}/eleves/${eleveSel}/lignes`);
      setLignes(data.lignes ?? []);
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
        {sousTitre && <p className="mt-2 text-sm text-slate-600">{sousTitre}</p>}

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
          <select name="sexe" className="rounded border px-3 py-2">
            <option value="">Sexe (barème BAC CI)</option>
            <option value="M">M — Garçon</option>
            <option value="F">F — Fille</option>
          </select>
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
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"
          >
            <option value="">— Choisir —</option>
            {eleves.map((el) => (
              <option key={el.id} value={el.id}>
                {el.nom} {el.prenom} {el.classe ? `(${el.classe})` : ''}
              </option>
            ))}
          </select>
        </div>

        {eleveSel && (
          <>
            <form
              onSubmit={ajouterLigne}
              className="mt-6 flex flex-wrap gap-3 rounded-xl border border-slate-200 bg-white p-4"
            >
              <select name="code_epreuve" required className="rounded border px-2 py-2">
                <option value="">Épreuve</option>
                {epreuves.map((ep) => (
                  <option key={ep.code} value={ep.code}>
                    {ep.label}
                  </option>
                ))}
              </select>
              <input
                name="valeur"
                type="number"
                step="any"
                required
                placeholder="Valeur mesurée"
                className="rounded border px-2 py-2"
              />
              <button type="submit" className="rounded-lg bg-sky-700 px-4 py-2 font-medium text-white">
                Enregistrer épreuve
              </button>
            </form>

            <table className="mt-6 w-full border-collapse text-sm">
              <thead>
                <tr className="border-b bg-slate-100 text-left">
                  <th className="p-2">Épreuve</th>
                  <th className="p-2">Valeur</th>
                  <th className="p-2">Points</th>
                </tr>
              </thead>
              <tbody>
                {lignes.map((l) => (
                  <tr key={l.id} className="border-b">
                    <td className="p-2">{l.code_epreuve}</td>
                    <td className="p-2">{l.valeur_brute}</td>
                    <td className="p-2 font-medium">{l.points_attribues}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}
