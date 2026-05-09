import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext.jsx';

export function PaiementCollectifEcole() {
  const { utilisateur } = useAuth();
  const [professeurs, setProfesseurs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectionProf, setSelectionProf] = useState(() => new Set());
  const [idsApps, setIdsApps] = useState([]); // liste UUID sélectionnés (cases à cocher)
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');
  const [soumission, setSoumission] = useState(false);

  const charger = useCallback(async () => {
    setErreur('');
    setChargement(true);
    try {
      const [p, a] = await Promise.all([
        api.get('/api/ecole/professeurs'),
        api.get('/api/catalogue/applications'),
      ]);
      setProfesseurs(p.data.professeurs ?? []);
      const eps = (a.data.applications ?? []).filter(
        (app) => app.rubrique === 'ENSEIGNEMENT_CI'
      );
      setApplications(eps);
    } catch (err) {
      setErreur(err.response?.data?.erreur || err.message || 'Chargement impossible.');
    } finally {
      setChargement(false);
    }
  }, []);

  useEffect(() => {
    charger();
  }, [charger]);

  const appsSelection = useMemo(() => new Set(idsApps), [idsApps]);

  function basculerProf(id) {
    setSelectionProf((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  }

  function basculerApp(id) {
    setIdsApps((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  const totalEstime = useMemo(() => {
    let s = 0;
    for (const app of applications) {
      if (appsSelection.has(app.id)) {
        s += Number(app.prix_individuel);
      }
    }
    return Math.round(s * Math.max(1, selectionProf.size));
  }, [applications, appsSelection, selectionProf.size]);

  async function payer(e) {
    e.preventDefault();
    setErreur('');
    if (!utilisateur?.ecole_id) {
      setErreur('Votre compte admin doit être rattaché à une école (ecole_id).');
      return;
    }
    if (selectionProf.size === 0 || idsApps.length === 0) {
      setErreur('Sélectionnez au moins un professeur et une application.');
      return;
    }

    const beneficiaires = [...selectionProf].map((uid) => ({
      utilisateur_id: uid,
      apps_incluses: idsApps,
      rubrique: 'ENSEIGNEMENT_CI',
      type_abonnement: 'a_la_carte',
      programme: 'ivoirien',
      sport: null,
    }));

    setSoumission(true);
    try {
      const { data } = await api.post('/api/paiements/wave/session-collectif', {
        ecole_id: utilisateur.ecole_id,
        beneficiaires,
        duree_jours: 30,
      });
      if (data.wave_launch_url) {
        window.location.href = data.wave_launch_url;
        return;
      }
      setErreur('Réponse Wave incomplète.');
    } catch (err) {
      setErreur(err.response?.data?.erreur || err.message || 'Erreur.');
    } finally {
      setSoumission(false);
    }
  }

  if (utilisateur?.type_utilisateur !== 'admin_ecole') {
    return (
      <div className="mx-auto max-w-lg px-6 py-16 text-center">
        <p className="text-slate-700">Réservé aux administrateurs d’école.</p>
        <Link to="/tableau-de-bord" className="mt-4 inline-block text-sky-700 hover:underline">
          Retour
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <Link to="/tableau-de-bord" className="text-sm font-medium text-sky-700 hover:underline">
          ← Tableau de bord
        </Link>
        <h1 className="mt-6 text-2xl font-bold text-slate-900">Paiement collectif (école)</h1>
        <p className="mt-2 text-sm text-slate-600">
          Un seul paiement Wave pour activer le même pack d’applications EPS pour plusieurs professeurs
          rattachés à votre école.
        </p>

        {chargement && <p className="mt-8 text-slate-600">Chargement…</p>}

        {!chargement && (
          <form onSubmit={payer} className="mt-8 space-y-8">
            {erreur && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                {erreur}
              </div>
            )}

            <section>
              <h2 className="font-semibold text-slate-900">Professeurs EPS</h2>
              <ul className="mt-3 space-y-2">
                {professeurs.map((p) => (
                  <li key={p.id}>
                    <label className="flex cursor-pointer gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
                      <input
                        type="checkbox"
                        checked={selectionProf.has(p.id)}
                        onChange={() => basculerProf(p.id)}
                      />
                      <span>
                        {p.prenom} {p.nom}{' '}
                        <span className="text-xs text-slate-500">({p.email})</span>
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
              {professeurs.length === 0 && (
                <p className="mt-2 text-sm text-amber-800">
                  Aucun prof EPS rattaché à cette école. Assignez `ecole_id` et type `prof_eps` en base
                  pour vos comptes profs.
                </p>
              )}
            </section>

            <section>
              <h2 className="font-semibold text-slate-900">
                Applications (programme ivoirien — même pack pour tous)
              </h2>
              <ul className="mt-3 space-y-2">
                {applications.map((app) => (
                  <li key={app.id}>
                    <label className="flex cursor-pointer gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
                      <input
                        type="checkbox"
                        checked={idsApps.includes(app.id)}
                        onChange={() => basculerApp(app.id)}
                      />
                      <span>
                        {app.icone} {app.nom} —{' '}
                        {Number(app.prix_individuel).toLocaleString('fr-CI')} FCFA
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </section>

            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
              <p className="text-sm text-slate-600">Total estimé (× nombre de profs)</p>
              <p className="text-2xl font-bold text-slate-900">
                {totalEstime.toLocaleString('fr-CI')} FCFA
              </p>
            </div>

            <button
              type="submit"
              disabled={soumission || professeurs.length === 0}
              className="w-full rounded-xl bg-orange-500 py-3 font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
            >
              {soumission ? 'Connexion Wave…' : 'Payer pour les profs sélectionnés'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
