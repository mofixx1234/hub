import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { api } from '../../api/client';

const TYPES = ['Course', 'Saut', 'Jeux collectifs', 'Gymnastique', 'Sports collectifs', 'Autre'];

function ligneVide(eleve) {
  return {
    eleve_id: eleve.id,
    note: '',
    absent: false,
    observation: '',
  };
}

export function SaisirNoteClasse() {
  const { classeId } = useParams();
  const [search, setSearch] = useSearchParams();
  const seanceFromUrl = search.get('seance');

  const [eleves, setEleves] = useState([]);
  const [seanceId, setSeanceId] = useState(seanceFromUrl || null);
  const [formSeance, setFormSeance] = useState({
    titre: '',
    date_seance: new Date().toISOString().slice(0, 10),
    type_activite: TYPES[0],
    coefficient: 1,
    trimestre: 'T1',
  });
  const [lignes, setLignes] = useState([]);
  const [err, setErr] = useState('');
  const [sauve, setSauve] = useState('');
  const [charge, setCharge] = useState(true);

  const syncLignesFromEleves = useCallback((list) => {
    setLignes(list.map((e) => ligneVide(e)));
  }, []);

  const chargerEleves = useCallback(async () => {
    const { data } = await api.get(`/api/apps/eval-classe/classes/${classeId}/eleves`);
    const el = data.eleves || [];
    setEleves(el);
    return el;
  }, [classeId]);

  const chargerSeanceEtNotes = useCallback(
    async (sid, listEleves) => {
      const { data } = await api.get(`/api/apps/eval-classe/seances/${sid}`);
      const notesMap = new Map();
      for (const n of data.seance.notes || []) {
        notesMap.set(n.eleve_id, n);
      }
      setLignes(
        listEleves.map((e) => {
          const n = notesMap.get(e.id);
          return {
            eleve_id: e.id,
            note: n && n.note != null && !n.absent ? String(n.note) : '',
            absent: Boolean(n?.absent),
            observation: n?.observation || '',
          };
        })
      );
    },
    []
  );

  useEffect(() => {
    let ignore = false;
    async function run() {
      setErr('');
      setCharge(true);
      try {
        const el = await chargerEleves();
        if (ignore) return;
        const sid = seanceFromUrl;
        setSeanceId(sid);
        if (sid && el.length) await chargerSeanceEtNotes(sid, el);
        else syncLignesFromEleves(el);
      } catch (e) {
        if (!ignore) setErr(e.response?.data?.erreur || e.message);
      } finally {
        if (!ignore) setCharge(false);
      }
    }
    run();
    return () => {
      ignore = true;
    };
  }, [chargerEleves, chargerSeanceEtNotes, classeId, seanceFromUrl, syncLignesFromEleves]);

  async function creerSeance(e) {
    e.preventDefault();
    setErr('');
    try {
      const { data } = await api.post(`/api/apps/eval-classe/classes/${classeId}/seances`, {
        titre: formSeance.titre.trim(),
        date_seance: formSeance.date_seance,
        type_activite: formSeance.type_activite,
        coefficient: Number(formSeance.coefficient),
        trimestre: formSeance.trimestre,
      });
      const sid = data.seance.id;
      setSeanceId(sid);
      setSearch({ seance: sid });
      const el = await chargerEleves();
      await chargerSeanceEtNotes(sid, el);
    } catch (ex) {
      setErr(ex.response?.data?.erreur || ex.message);
    }
  }

  function majLigne(i, patch) {
    setLignes((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], ...patch };
      if (patch.absent) next[i].note = '';
      return next;
    });
  }

  const payloadNotes = useMemo(
    () =>
      lignes.map((l) => ({
        eleve_id: l.eleve_id,
        absent: l.absent,
        note: l.absent || l.note === '' ? null : Number(l.note),
        observation: l.observation || null,
      })),
    [lignes]
  );

  const envoyerNotes = useCallback(async () => {
    if (!seanceId) return;
    setErr('');
    try {
      await api.put(`/api/apps/eval-classe/seances/${seanceId}/notes`, { lignes: payloadNotes });
      setSauve(new Date().toLocaleTimeString('fr-FR'));
    } catch (ex) {
      setErr(ex.response?.data?.erreur || ex.message);
    }
  }, [payloadNotes, seanceId]);

  useEffect(() => {
    if (!seanceId) return undefined;
    const t = setInterval(() => {
      envoyerNotes().catch(() => {});
    }, 30000);
    return () => clearInterval(t);
  }, [seanceId, envoyerNotes]);

  if (charge) {
    return (
      <div className="flex items-center gap-2 text-slate-600">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-sky-600 border-t-transparent" />
        Chargement…
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <Link
          to={`/apps/eval-classe/classe/${classeId}`}
          className="text-sm font-medium text-sky-700 hover:underline"
        >
          ← Classe
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">Saisie des notes</h1>
      </div>

      {err && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{err}</div>
      )}

      {!seanceId && (
        <form
          onSubmit={creerSeance}
          className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900"
        >
          <h2 className="font-semibold text-slate-900 dark:text-white">Étape 1 — Créer la séance</h2>
          <label className="block text-sm">
            Titre
            <input
              required
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              value={formSeance.titre}
              onChange={(e) => setFormSeance((f) => ({ ...f, titre: e.target.value }))}
              placeholder="Course de vitesse - 50m"
            />
          </label>
          <label className="block text-sm">
            Date
            <input
              type="date"
              required
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              value={formSeance.date_seance}
              onChange={(e) => setFormSeance((f) => ({ ...f, date_seance: e.target.value }))}
            />
          </label>
          <label className="block text-sm">
            Type d&apos;activité
            <select
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              value={formSeance.type_activite}
              onChange={(e) => setFormSeance((f) => ({ ...f, type_activite: e.target.value }))}
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              Coefficient
              <select
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                value={formSeance.coefficient}
                onChange={(e) => setFormSeance((f) => ({ ...f, coefficient: Number(e.target.value) }))}
              >
                {[1, 2, 3].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              Trimestre
              <select
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                value={formSeance.trimestre}
                onChange={(e) => setFormSeance((f) => ({ ...f, trimestre: e.target.value }))}
              >
                {['T1', 'T2', 'T3'].map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <button
            type="submit"
            className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Continuer vers la saisie
          </button>
        </form>
      )}

      {seanceId && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-semibold text-slate-900 dark:text-white">
              Étape 2 — Notes par élève
            </h2>
            {sauve && (
              <span className="text-sm text-emerald-700 dark:text-emerald-400">
                💾 Sauvegardé ({sauve})
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500">
            Sauvegarde automatique toutes les 30 s. Tab pour passer d&apos;une cellule à l&apos;autre.
          </p>

          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
                <tr>
                  <th className="px-3 py-2">Élève</th>
                  <th className="px-3 py-2">Note (/20)</th>
                  <th className="px-3 py-2">Absent</th>
                  <th className="px-3 py-2">Observation</th>
                </tr>
              </thead>
              <tbody>
                {eleves.map((el, i) => (
                  <tr key={el.id} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="px-3 py-2 font-medium text-slate-900 dark:text-white">
                      {el.prenom} {el.nom}
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        min={0}
                        max={20}
                        step={0.25}
                        disabled={lignes[i]?.absent}
                        className="w-20 rounded border border-slate-300 px-2 py-1 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                        value={lignes[i]?.note ?? ''}
                        onChange={(e) => majLigne(i, { note: e.target.value })}
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="checkbox"
                        checked={Boolean(lignes[i]?.absent)}
                        onChange={(e) => majLigne(i, { absent: e.target.checked })}
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        className="w-full min-w-[8rem] rounded border border-slate-300 px-2 py-1 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                        value={lignes[i]?.observation ?? ''}
                        onChange={(e) => majLigne(i, { observation: e.target.value })}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            type="button"
            onClick={() => envoyerNotes()}
            className="rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-700"
          >
            Enregistrer maintenant
          </button>
        </div>
      )}
    </div>
  );
}
