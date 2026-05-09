import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';

export function GestionEquipe() {
  const [joueurs, setJoueurs] = useState([]);
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(true);
  const [nom, setNom] = useState('');
  const [numero, setNumero] = useState('');
  const [position, setPosition] = useState('');

  const charger = useCallback(async () => {
    setErreur('');
    setChargement(true);
    try {
      const { data } = await api.get('/api/apps/sport/joueurs');
      setJoueurs(data.joueurs ?? []);
    } catch (err) {
      setErreur(
        err.response?.data?.erreur ||
          err.message ||
          'Accès refusé ou abonnement « Gestion d’équipe » requis.'
      );
    } finally {
      setChargement(false);
    }
  }, []);

  useEffect(() => {
    charger();
  }, [charger]);

  async function ajouter(e) {
    e.preventDefault();
    setErreur('');
    try {
      await api.post('/api/apps/sport/joueurs', {
        nom: nom.trim(),
        numero: numero ? Number(numero) : null,
        position: position.trim() || null,
      });
      setNom('');
      setNumero('');
      setPosition('');
      await charger();
    } catch (err) {
      setErreur(err.response?.data?.erreur || err.message || 'Erreur.');
    }
  }

  async function retirer(id) {
    if (!window.confirm('Mettre ce joueur à la corbeille ?')) return;
    try {
      await api.delete(`/api/apps/sport/joueurs/${id}`);
      await charger();
    } catch (err) {
      setErreur(err.response?.data?.erreur || err.message || 'Erreur.');
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <Link to="/tableau-de-bord" className="text-sm font-medium text-sky-700 hover:underline">
          ← Tableau de bord
        </Link>
        <h1 className="mt-6 text-2xl font-bold text-slate-900">Gestion d’équipe</h1>
        <p className="mt-2 text-sm text-slate-600">
          Données isolées par entraîneur. Abonnement « Gestion d’équipe » (Sport) requis.
        </p>

        {erreur && (
          <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {erreur}
          </div>
        )}

        <form
          onSubmit={ajouter}
          className="mt-8 grid gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-2"
        >
          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-slate-700">Nom du joueur</label>
            <input
              required
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Numéro</label>
            <input
              type="number"
              min={0}
              max={99}
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Poste</label>
            <input
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="Meneur, pivot…"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="rounded-xl bg-sky-700 px-5 py-2.5 font-semibold text-white hover:bg-sky-800"
            >
              Ajouter
            </button>
          </div>
        </form>

        <div className="mt-10">
          <h2 className="text-lg font-semibold text-slate-900">Effectif</h2>
          {chargement && <p className="mt-4 text-slate-600">Chargement…</p>}
          {!chargement && joueurs.length === 0 && !erreur && (
            <p className="mt-4 text-slate-600">Aucun joueur pour l’instant.</p>
          )}
          <ul className="mt-4 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
            {joueurs.map((j) => (
              <li key={j.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                <div>
                  <span className="font-medium text-slate-900">{j.nom}</span>
                  {j.numero != null && (
                    <span className="ml-2 rounded bg-slate-100 px-2 py-0.5 text-xs">
                      #{j.numero}
                    </span>
                  )}
                  {j.position && (
                    <span className="ml-2 text-sm text-slate-600">{j.position}</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => retirer(j.id)}
                  className="text-sm text-red-700 hover:underline"
                >
                  Corbeille
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
