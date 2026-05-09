import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { api } from '../api/client';

function mergeDraft(joueurs, detail) {
  const out = {};
  for (const j of joueurs) {
    const ligne = detail?.lignes?.find((l) => l.joueur_id === j.id);
    out[j.id] = {
      points: ligne?.points ?? 0,
      passes: ligne?.passes ?? 0,
      rebonds: ligne?.rebonds ?? 0,
      minutes_jeu:
        ligne?.minutes_jeu != null && ligne.minutes_jeu !== ''
          ? String(ligne.minutes_jeu)
          : '',
    };
  }
  return out;
}

export function Statistiques() {
  const [matchs, setMatchs] = useState([]);
  const [selection, setSelection] = useState('');
  const [detail, setDetail] = useState(null);
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(true);
  const [joueurs, setJoueurs] = useState([]);
  const [joueursPret, setJoueursPret] = useState(false);
  const [sansListeJoueurs, setSansListeJoueurs] = useState(false);
  const [statsParJoueur, setStatsParJoueur] = useState({});
  const [enregistrement, setEnregistrement] = useState(false);

  const chargerMatchs = useCallback(async () => {
    setErreur('');
    try {
      const { data } = await api.get('/api/apps/sport/stats/matchs');
      setMatchs(data.matchs ?? []);
    } catch (e) {
      setErreur(e.response?.data?.erreur || e.message || 'Accès refusé ou abonnement Stats requis.');
    } finally {
      setChargement(false);
    }
  }, []);

  const chargerJoueurs = useCallback(async () => {
    try {
      const { data } = await api.get('/api/apps/sport/joueurs');
      setJoueurs(data.joueurs ?? []);
      setSansListeJoueurs(false);
    } catch (e) {
      const st = e.response?.status;
      if (st === 403 || st === 401) {
        setSansListeJoueurs(true);
      }
      setJoueurs([]);
    } finally {
      setJoueursPret(true);
    }
  }, []);

  useEffect(() => {
    chargerMatchs();
    chargerJoueurs();
  }, [chargerMatchs, chargerJoueurs]);

  useEffect(() => {
    let ignore = false;
    async function loadDetail() {
      if (!selection) {
        setDetail(null);
        return;
      }
      try {
        const { data } = await api.get(`/api/apps/sport/stats/matchs/${selection}`);
        if (!ignore) setDetail(data);
      } catch {
        if (!ignore) setDetail(null);
      }
    }
    loadDetail();
    return () => {
      ignore = true;
    };
  }, [selection]);

  useEffect(() => {
    if (!joueurs.length || !detail) {
      return;
    }
    setStatsParJoueur(mergeDraft(joueurs, detail));
  }, [joueurs, detail]);

  const chartData = useMemo(() => {
    if (!detail?.lignes?.length) return [];
    return detail.lignes.map((l) => ({
      nom: l.nom_joueur || l.joueur_id.slice(0, 8),
      points: l.points,
      passes: l.passes,
      rebonds: l.rebonds,
    }));
  }, [detail]);

  async function creerMatchRapide(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const adversaire = fd.get('adversaire');
    const joue_le = fd.get('joue_le');
    try {
      await api.post('/api/apps/sport/stats/matchs', {
        adversaire,
        joue_le,
      });
      e.target.reset();
      await chargerMatchs();
    } catch (err) {
      setErreur(err.response?.data?.erreur || err.message);
    }
  }

  function majStat(joueurId, champ, valeur) {
    setStatsParJoueur((prev) => ({
      ...prev,
      [joueurId]: { ...prev[joueurId], [champ]: valeur },
    }));
  }

  async function enregistrerLignes(e) {
    e.preventDefault();
    if (!selection || !joueurs.length) return;
    setEnregistrement(true);
    setErreur('');
    try {
      const lignes = joueurs.map((j) => {
        const s = statsParJoueur[j.id] || {};
        const minRaw = s.minutes_jeu;
        const minutes_jeu =
          minRaw === '' || minRaw === undefined || minRaw === null
            ? null
            : Number(minRaw);
        return {
          joueur_id: j.id,
          points: Number(s.points) || 0,
          passes: Number(s.passes) || 0,
          rebonds: Number(s.rebonds) || 0,
          minutes_jeu: Number.isFinite(minutes_jeu) ? minutes_jeu : null,
        };
      });
      await api.post(`/api/apps/sport/stats/matchs/${selection}/lignes`, { lignes });
      const { data } = await api.get(`/api/apps/sport/stats/matchs/${selection}`);
      setDetail(data);
    } catch (err) {
      setErreur(err.response?.data?.erreur || err.message || 'Enregistrement impossible.');
    } finally {
      setEnregistrement(false);
    }
  }

  const peutSaisirStats =
    joueursPret && selection && joueurs.length > 0 && !sansListeJoueurs;

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <Link to="/tableau-de-bord" className="text-sm font-medium text-sky-700 hover:underline">
          ← Tableau de bord
        </Link>
        <h1 className="mt-6 text-2xl font-bold text-slate-900">Statistiques matchs</h1>
        <p className="mt-2 text-sm text-slate-600">
          Abonnement « Statistiques » requis. Pour remplir le tableau ci-dessous, l’abonnement « Gestion
          d’équipe » est aussi nécessaire (liste des joueurs).
        </p>

        {erreur && (
          <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {erreur}
          </div>
        )}

        {joueursPret && sansListeJoueurs && (
          <div className="mt-6 rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-900">
            Vous n’avez pas accès à la liste des joueurs (abonnement « Gestion d’équipe » requis).{' '}
            <Link className="font-medium underline" to="/apps/sport/gestion-equipe">
              Gérer l’équipe
            </Link>{' '}
            ou souscrire à cette application pour saisir les stats par joueur.
          </div>
        )}

        {joueursPret && !sansListeJoueurs && joueurs.length === 0 && (
          <div className="mt-6 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
            Aucun joueur enregistré.{' '}
            <Link className="font-medium text-sky-700 underline" to="/apps/sport/gestion-equipe">
              Ajouter des joueurs
            </Link>{' '}
            dans « Gestion d’équipe ».
          </div>
        )}

        {!chargement && (
          <>
            <form
              onSubmit={creerMatchRapide}
              className="mt-8 flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-4"
            >
              <div>
                <label className="block text-xs font-medium text-slate-600">Date</label>
                <input
                  name="joue_le"
                  type="date"
                  required
                  className="mt-1 rounded border border-slate-300 px-2 py-1"
                />
              </div>
              <div className="min-w-[200px] flex-1">
                <label className="block text-xs font-medium text-slate-600">Adversaire</label>
                <input
                  name="adversaire"
                  required
                  placeholder="Nom équipe"
                  className="mt-1 w-full rounded border border-slate-300 px-2 py-1"
                />
              </div>
              <button
                type="submit"
                className="rounded-lg bg-sky-700 px-4 py-2 text-sm font-semibold text-white"
              >
                Nouveau match
              </button>
            </form>

            <div className="mt-8">
              <label className="text-sm font-medium text-slate-700">Match à analyser</label>
              <select
                value={selection}
                onChange={(e) => setSelection(e.target.value)}
                className="mt-2 w-full max-w-md rounded-lg border border-slate-300 px-3 py-2"
              >
                <option value="">— Choisir —</option>
                {matchs.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.joue_le} — {m.adversaire}
                  </option>
                ))}
              </select>
            </div>

            {peutSaisirStats && (
              <form
                onSubmit={enregistrerLignes}
                className="mt-8 overflow-x-auto rounded-xl border border-slate-200 bg-white"
              >
                <table className="min-w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b bg-slate-100 text-left">
                      <th className="p-3 font-semibold text-slate-700">Joueur</th>
                      <th className="p-3 font-semibold text-slate-700">Points</th>
                      <th className="p-3 font-semibold text-slate-700">Passes</th>
                      <th className="p-3 font-semibold text-slate-700">Rebonds</th>
                      <th className="p-3 font-semibold text-slate-700">Minutes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {joueurs.map((j) => {
                      const s = statsParJoueur[j.id] || {};
                      return (
                        <tr key={j.id} className="border-b border-slate-100">
                          <td className="p-3 font-medium text-slate-900">{j.nom}</td>
                          <td className="p-2">
                            <input
                              type="number"
                              min={0}
                              max={200}
                              className="w-20 rounded border px-2 py-1"
                              value={s.points ?? ''}
                              onChange={(e) => majStat(j.id, 'points', e.target.value)}
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              min={0}
                              max={200}
                              className="w-20 rounded border px-2 py-1"
                              value={s.passes ?? ''}
                              onChange={(e) => majStat(j.id, 'passes', e.target.value)}
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              min={0}
                              max={200}
                              className="w-20 rounded border px-2 py-1"
                              value={s.rebonds ?? ''}
                              onChange={(e) => majStat(j.id, 'rebonds', e.target.value)}
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              min={0}
                              max={80}
                              className="w-20 rounded border px-2 py-1"
                              placeholder="—"
                              value={s.minutes_jeu ?? ''}
                              onChange={(e) => majStat(j.id, 'minutes_jeu', e.target.value)}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div className="border-t border-slate-100 p-4">
                  <button
                    type="submit"
                    disabled={enregistrement}
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
                  >
                    {enregistrement ? 'Enregistrement…' : 'Enregistrer les stats du match'}
                  </button>
                </div>
              </form>
            )}

            {selection && chartData.length > 0 && (
              <div className="mt-10 h-80 w-full rounded-xl border border-slate-200 bg-white p-4">
                <h2 className="mb-4 text-sm font-semibold text-slate-800">Points par joueur</h2>
                <ResponsiveContainer width="100%" height="90%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nom" tick={{ fontSize: 11 }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="points" fill="#0369a1" name="Points" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {selection && detail && chartData.length === 0 && (
              <p className="mt-6 text-sm text-slate-600">
                Aucune donnée graphique pour ce match — renseignez le tableau ci-dessus puis enregistrez.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
