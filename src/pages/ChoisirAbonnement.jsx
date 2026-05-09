import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext.jsx';
import { Navbar } from '../components/Layout/Navbar.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Card } from '../components/ui/Card.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Alert } from '../components/ui/Alert.jsx';
import { Spinner } from '../components/ui/Spinner.jsx';

/**
 * Parcours d’abonnement en 5 étapes — mobile-first, barre de progression.
 */
export function ChoisirAbonnement() {
  const { connecte } = useAuth();
  const [applications, setApplications] = useState([]);
  const [ecoles, setEcoles] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');

  const [etape, setEtape] = useState(1);
  const [rubriqueGrand, setRubriqueGrand] = useState('SPORT');
  const [programmeEns, setProgrammeEns] = useState('ivoirien');
  const [typeFr, setTypeFr] = useState('ecole');
  /** formule = tout inclus ; carte = à la carte */
  const [modeFormule, setModeFormule] = useState('formule');
  const [idsSelection, setIdsSelection] = useState(() => new Set());
  const [sport, setSport] = useState('basketball');
  const [ecoleId, setEcoleId] = useState('');
  const [soumission, setSoumission] = useState(false);

  const charger = useCallback(async () => {
    setErreur('');
    setChargement(true);
    try {
      const [a, e] = await Promise.all([
        api.get('/api/catalogue/applications'),
        api.get('/api/catalogue/ecoles'),
      ]);
      setApplications(a.data.applications ?? []);
      const listeEcoles = e.data.ecoles ?? [];
      setEcoles(listeEcoles);
      if (listeEcoles.length === 1) setEcoleId(listeEcoles[0].id);
    } catch (err) {
      setErreur(err.response?.data?.erreur || err.message || 'Erreur chargement catalogue.');
    } finally {
      setChargement(false);
    }
  }, []);

  useEffect(() => {
    charger();
  }, [charger]);

  const rubriqueApi = useMemo(() => {
    if (rubriqueGrand === 'SPORT') return 'SPORT';
    if (programmeEns === 'ivoirien') return 'ENSEIGNEMENT_CI';
    return 'ENSEIGNEMENT_FR';
  }, [rubriqueGrand, programmeEns]);

  const programmeApi = rubriqueApi === 'ENSEIGNEMENT_FR' ? 'francais' : 'ivoirien';

  const appsFiltrees = useMemo(() => {
    let list = applications.filter((app) => app.rubrique === rubriqueApi);
    if (rubriqueApi === 'ENSEIGNEMENT_FR' && typeFr === 'candidat') {
      list = list.filter((app) => !app.specifique_ecole);
    }
    return list;
  }, [applications, rubriqueApi, typeFr]);

  useEffect(() => {
    if (modeFormule === 'formule' && appsFiltrees.length > 0) {
      setIdsSelection(new Set(appsFiltrees.map((a) => a.id)));
    }
  }, [modeFormule, appsFiltrees]);

  const total = useMemo(() => {
    let s = 0;
    for (const app of appsFiltrees) {
      if (idsSelection.has(app.id)) s += Number(app.prix_individuel);
    }
    return Math.round(s);
  }, [appsFiltrees, idsSelection]);

  const progression = Math.round((etape / 5) * 100);

  function basculerApp(id) {
    if (modeFormule === 'formule') return;
    setIdsSelection((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function allerEtapeSuivante() {
    setErreur('');
    if (etape === 1) {
      if (rubriqueGrand === 'SPORT') setEtape(4);
      else setEtape(2);
      return;
    }
    if (etape === 2) {
      if (programmeEns === 'ivoirien') setEtape(4);
      else setEtape(3);
      return;
    }
    if (etape === 3) {
      setEtape(4);
      return;
    }
    if (etape === 4) {
      setEtape(5);
      return;
    }
  }

  function allerEtapePrecedente() {
    setErreur('');
    if (etape === 4) {
      if (rubriqueGrand === 'SPORT') setEtape(1);
      else if (programmeEns === 'ivoirien') setEtape(2);
      else setEtape(3);
      return;
    }
    if (etape === 5) {
      setEtape(4);
      return;
    }
    if (etape === 3) {
      setEtape(2);
      return;
    }
    if (etape === 2) {
      setEtape(1);
      return;
    }
  }

  async function payer(e) {
    e.preventDefault();
    setErreur('');
    if (idsSelection.size === 0) {
      setErreur('Sélectionnez au moins une application.');
      return;
    }
    if (rubriqueApi === 'ENSEIGNEMENT_FR' && typeFr === 'ecole' && !ecoleId) {
      setErreur('Choisissez une école homologuée.');
      return;
    }

    setSoumission(true);
    try {
      const parcoursFrancais =
        rubriqueApi === 'ENSEIGNEMENT_FR'
          ? typeFr === 'candidat'
            ? 'candidat_libre'
            : 'ecole_homologuee'
          : undefined;

      const { data } = await api.post('/api/paiements/wave/session', {
        montant: total,
        apps_incluses: [...idsSelection],
        rubrique: rubriqueApi,
        type_abonnement: modeFormule === 'formule' ? 'formule' : 'a_la_carte',
        programme: programmeApi,
        sport: rubriqueApi === 'SPORT' ? sport || null : null,
        ecole_id:
          rubriqueApi === 'ENSEIGNEMENT_FR' && typeFr === 'ecole' ? ecoleId : null,
        parcours_francais: parcoursFrancais,
        duree_jours: 30,
      });

      if (data.wave_launch_url) {
        window.location.href = data.wave_launch_url;
        return;
      }
      setErreur('Réponse Wave incomplète.');
    } catch (err) {
      const msg =
        err.response?.data?.erreur ||
        err.response?.data?.detail ||
        err.message ||
        'Échec création session.';
      setErreur(msg);
    } finally {
      setSoumission(false);
    }
  }

  const bloquePaiement = total === 0;

  return (
    <div className="flex min-h-screen flex-col bg-hub-dark font-sans text-hub-text">
      <Navbar variant="app" connecte={connecte} />

      <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-6 sm:px-6">
        <Link
          to="/tableau-de-bord"
          className="text-sm font-medium text-hub-primary hover:underline"
        >
          ← Tableau de bord
        </Link>

        <h1 className="mt-4 text-2xl font-bold text-white">Choisir mon abonnement</h1>
        <p className="mt-2 text-sm text-hub-muted">
          Étape par étape — le montant est recalculé côté serveur avant Wave.
        </p>

        {/* Barre de progression */}
        <div className="mt-6">
          <div className="mb-1 flex justify-between text-xs text-hub-muted">
            <span>
              Étape {etape} sur 5
            </span>
            <span>{progression}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-hub-surface2">
            <div
              className="h-full rounded-full bg-hub-primary transition-all duration-300"
              style={{ width: `${progression}%` }}
            />
          </div>
        </div>

        {chargement && (
          <div className="mt-12 flex justify-center">
            <Spinner className="h-10 w-10" />
          </div>
        )}

        {!chargement && (
          <div className="mt-8 space-y-6">
            {erreur && <Alert type="danger">{erreur}</Alert>}

            {etape === 1 && (
              <Card>
                <h2 className="text-lg font-semibold text-white">1. Rubrique</h2>
                <p className="mt-1 text-sm text-hub-muted">Que souhaitez-vous utiliser ?</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setRubriqueGrand('SPORT')}
                    className={`rounded-xl border-2 p-4 text-left transition-colors ${
                      rubriqueGrand === 'SPORT'
                        ? 'border-hub-primary bg-hub-primary/10'
                        : 'border-hub-border bg-hub-surface2 hover:border-hub-muted'
                    }`}
                  >
                    <span className="text-2xl">🏀</span>
                    <p className="mt-2 font-semibold text-white">Sport</p>
                    <p className="text-xs text-hub-muted">Clubs & entraîneurs</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRubriqueGrand('ENSEIGNEMENT')}
                    className={`rounded-xl border-2 p-4 text-left transition-colors ${
                      rubriqueGrand === 'ENSEIGNEMENT'
                        ? 'border-hub-secondary bg-hub-secondary/10'
                        : 'border-hub-border bg-hub-surface2 hover:border-hub-muted'
                    }`}
                  >
                    <span className="text-2xl">📚</span>
                    <p className="mt-2 font-semibold text-white">Enseignement</p>
                    <p className="text-xs text-hub-muted">Professeurs d&apos;EPS</p>
                  </button>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button type="button" onClick={allerEtapeSuivante}>
                    Suivant
                  </Button>
                </div>
              </Card>
            )}

            {etape === 2 && rubriqueGrand === 'ENSEIGNEMENT' && (
              <Card>
                <h2 className="text-lg font-semibold text-white">2. Programme</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setProgrammeEns('ivoirien')}
                    className={`rounded-xl border-2 p-4 text-left ${
                      programmeEns === 'ivoirien'
                        ? 'border-hub-primary bg-hub-primary/10'
                        : 'border-hub-border bg-hub-surface2'
                    }`}
                  >
                    <span className="text-xl">🇨🇮</span>
                    <Badge variant="primary" className="mt-2 inline-block">
                      Programme Ivoirien
                    </Badge>
                    <p className="mt-2 font-semibold text-white">Programme ivoirien</p>
                    <p className="mt-2 text-xs text-hub-muted">
                      Pour les enseignants du système éducatif ivoirien. Barèmes officiels MENA-CI.
                      Accès immédiat après paiement Wave.
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setProgrammeEns('francais')}
                    className={`rounded-xl border-2 p-4 text-left ${
                      programmeEns === 'francais'
                        ? 'border-hub-secondary bg-hub-secondary/10'
                        : 'border-hub-border bg-hub-surface2'
                    }`}
                  >
                    <span className="text-xl">🇫🇷</span>
                    <Badge variant="secondary" className="mt-2 inline-block">
                      Programme français
                    </Badge>
                    <p className="mt-2 font-semibold text-white">Programme français</p>
                    <p className="mt-2 text-xs text-hub-muted">
                      École homologuée ou candidat libre — choix à l’étape suivante.
                    </p>
                  </button>
                </div>
                <div className="mt-6 flex justify-between gap-2">
                  <Button type="button" variant="outline" onClick={allerEtapePrecedente}>
                    Retour
                  </Button>
                  <Button type="button" onClick={allerEtapeSuivante}>
                    Suivant
                  </Button>
                </div>
              </Card>
            )}

            {etape === 3 && rubriqueGrand === 'ENSEIGNEMENT' && programmeEns === 'francais' && (
              <Card>
                <h2 className="text-lg font-semibold text-white">3. Type d&apos;accès</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setTypeFr('ecole')}
                    className={`rounded-xl border-2 p-4 text-left ${
                      typeFr === 'ecole'
                        ? 'border-hub-success bg-hub-success/10'
                        : 'border-hub-border bg-hub-surface2'
                    }`}
                  >
                    <span className="text-xl">🏫</span>
                    <Badge variant="success" className="mt-2 inline-block">
                      École homologuée
                    </Badge>
                    <p className="mt-2 font-semibold text-white">École homologuée</p>
                    <p className="text-xs text-hub-muted">
                      Barèmes spécifiques à votre établissement. Accès après validation par l’école
                      (flux standard).
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTypeFr('candidat')}
                    className={`rounded-xl border-2 p-4 text-left ${
                      typeFr === 'candidat'
                        ? 'border-hub-warning bg-hub-warning/10'
                        : 'border-hub-border bg-hub-surface2'
                    }`}
                  >
                    <span className="text-xl">📝</span>
                    <Badge variant="warning" className="mt-2 inline-block">
                      Candidat libre
                    </Badge>
                    <p className="mt-2 font-semibold text-white">Candidat libre</p>
                    <p className="text-xs text-hub-muted">
                      Apps génériques programme français. E-mail personnel accepté. Paiement Wave → accès
                      immédiat, sans validation école.
                    </p>
                  </button>
                </div>
                {typeFr === 'candidat' && (
                  <Alert type="success" className="mt-4">
                    Parcours simplifié : aucune demande d’accès à une école. Tarif adapté aux candidats
                    indépendants.
                  </Alert>
                )}
                <div className="mt-6 flex justify-between gap-2">
                  <Button type="button" variant="outline" onClick={allerEtapePrecedente}>
                    Retour
                  </Button>
                  <Button type="button" onClick={allerEtapeSuivante}>
                    Suivant
                  </Button>
                </div>
              </Card>
            )}

            {etape === 4 && (
              <Card>
                <h2 className="text-lg font-semibold text-white">4. Formule</h2>
                {rubriqueGrand === 'SPORT' && (
                  <div className="mt-3">
                    <label className="text-sm text-hub-muted">Sport principal</label>
                    <input
                      value={sport}
                      onChange={(ev) => setSport(ev.target.value)}
                      className="mt-1 w-full min-h-12 rounded-xl border border-hub-border bg-hub-surface2 px-4 text-hub-text"
                      placeholder="ex. basketball"
                    />
                  </div>
                )}
                {rubriqueApi === 'ENSEIGNEMENT_FR' && typeFr === 'ecole' && (
                  <div className="mt-3">
                    <label className="text-sm text-hub-muted">École</label>
                    <select
                      required
                      value={ecoleId}
                      onChange={(ev) => setEcoleId(ev.target.value)}
                      className="mt-1 w-full min-h-12 rounded-xl border border-hub-border bg-hub-surface2 px-4 text-hub-text"
                    >
                      <option value="">— Choisir —</option>
                      {ecoles.map((ec) => (
                        <option key={ec.id} value={ec.id}>
                          {ec.nom}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => {
                      setModeFormule('formule');
                    }}
                    className={`rounded-xl border-2 p-4 text-left ${
                      modeFormule === 'formule'
                        ? 'border-hub-primary bg-hub-primary/10'
                        : 'border-hub-border bg-hub-surface2'
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-white">Formule complète</p>
                      <Badge variant="primary">Meilleure valeur</Badge>
                    </div>
                    <p className="mt-2 text-sm text-hub-muted">Toutes les apps de la rubrique</p>
                    <p className="mt-3 font-mono text-lg text-hub-primary">
                      {appsFiltrees.length
                        ? `${appsFiltrees.reduce((s, a) => s + Number(a.prix_individuel), 0).toLocaleString('fr-CI')} FCFA`
                        : '—'}
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setModeFormule('carte');
                      setIdsSelection(new Set());
                    }}
                    className={`rounded-xl border-2 p-4 text-left ${
                      modeFormule === 'carte'
                        ? 'border-hub-secondary bg-hub-secondary/10'
                        : 'border-hub-border bg-hub-surface2'
                    }`}
                  >
                    <p className="font-semibold text-white">À la carte</p>
                    <p className="mt-2 text-sm text-hub-muted">Choisissez vos applications</p>
                  </button>
                </div>

                {modeFormule === 'carte' && (
                  <ul className="mt-4 space-y-2">
                    {appsFiltrees.map((app) => (
                      <li key={app.id}>
                        <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-hub-border bg-hub-surface2 px-3 py-2">
                          <input
                            type="checkbox"
                            checked={idsSelection.has(app.id)}
                            onChange={() => basculerApp(app.id)}
                            className="h-5 w-5 accent-hub-primary"
                          />
                          <span className="flex-1 text-sm text-hub-text">
                            {app.icone} {app.nom}
                          </span>
                          <span className="font-mono text-sm text-hub-muted">
                            {Number(app.prix_individuel).toLocaleString('fr-CI')} F
                          </span>
                        </label>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-6 flex justify-between gap-2">
                  <Button type="button" variant="outline" onClick={allerEtapePrecedente}>
                    Retour
                  </Button>
                  <Button type="button" onClick={allerEtapeSuivante}>
                    Suivant
                  </Button>
                </div>
              </Card>
            )}

            {etape === 5 && (
              <Card>
                <h2 className="text-lg font-semibold text-white">5. Paiement Wave</h2>
                <div className="mt-4 space-y-2 rounded-xl bg-hub-surface2 p-4 text-sm">
                  <p>
                    <span className="text-hub-muted">Rubrique :</span>{' '}
                    <strong className="text-white">{rubriqueApi}</strong>
                  </p>
                  <p>
                    <span className="text-hub-muted">Formule :</span>{' '}
                    <strong className="text-white">
                      {modeFormule === 'formule' ? 'Complète' : 'À la carte'}
                    </strong>
                  </p>
                  <p>
                    <span className="text-hub-muted">Applications :</span>{' '}
                    <strong className="text-white">{idsSelection.size}</strong>
                  </p>
                  <p className="pt-2 text-xl font-bold text-hub-primary">
                    {total.toLocaleString('fr-CI')} FCFA
                  </p>
                </div>

                <form onSubmit={payer} className="mt-6">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={soumission || bloquePaiement}
                  >
                    {soumission
                      ? 'Connexion à Wave…'
                      : `💳 Payer ${total.toLocaleString('fr-CI')} FCFA avec Wave`}
                  </Button>
                </form>
                <div className="mt-4 flex justify-start">
                  <Button type="button" variant="ghost" onClick={allerEtapePrecedente}>
                    Retour
                  </Button>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
