import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext.jsx';
import {
  APP_EPS_BAC_CI,
  APP_EPS_BAC_JV,
  APP_EPS_CLASSE_CI,
  APP_EPS_CLASSE_JV,
  APP_SPORT_GESTION_EQUIPE,
  APP_SPORT_STATS,
} from '../constants/catalogue.js';
import { Sidebar } from '../components/Layout/Sidebar.jsx';
import { Onboarding } from '../components/Onboarding.jsx';

function formatDate(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('fr-CI', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return '—';
  }
}

function joursRestants(dateFin) {
  if (!dateFin) return null;
  const fin = new Date(dateFin).getTime();
  const maintenant = Date.now();
  return Math.ceil((fin - maintenant) / (24 * 60 * 60 * 1000));
}

export function TableauDeBord() {
  const { utilisateur, deconnexion } = useAuth();
  const [abonnements, setAbonnements] = useState([]);
  const [catalogue, setCatalogue] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');

  const charger = useCallback(async () => {
    setErreur('');
    setChargement(true);
    try {
      const [resHub, resCat] = await Promise.all([
        api.get('/api/mon-hub/abonnements'),
        api.get('/api/catalogue/applications'),
      ]);
      setAbonnements(resHub.data.abonnements ?? []);
      setCatalogue(resCat.data.applications ?? []);
    } catch (e) {
      setErreur(
        e.response?.data?.erreur || e.message || 'Impossible de charger vos données Hub.'
      );
    } finally {
      setChargement(false);
    }
  }, []);

  useEffect(() => {
    charger();
  }, [charger]);

  async function handleDeconnexion() {
    await deconnexion();
  }

  const alertesExpiration = useMemo(() => {
    return abonnements.filter((a) => {
      if (a.statut !== 'actif') return false;
      const j = joursRestants(a.date_fin);
      return j !== null && j >= 0 && j <= 7;
    });
  }, [abonnements]);

  const accesGestionEquipe = useMemo(() => {
    return abonnements.some(
      (a) =>
        a.statut === 'actif' &&
        (a.apps_incluses_ids || []).some((id) => String(id) === APP_SPORT_GESTION_EQUIPE)
    );
  }, [abonnements]);

  const accesStatistiques = useMemo(() => {
    return abonnements.some(
      (a) =>
        a.statut === 'actif' &&
        (a.apps_incluses_ids || []).some((id) => String(id) === APP_SPORT_STATS)
    );
  }, [abonnements]);

  const accesEpsBacCi = useMemo(() => {
    return abonnements.some(
      (a) =>
        a.statut === 'actif' &&
        (a.apps_incluses_ids || []).some((id) => String(id) === APP_EPS_BAC_CI)
    );
  }, [abonnements]);

  const accesEpsClasseCi = useMemo(() => {
    return abonnements.some(
      (a) =>
        a.statut === 'actif' &&
        (a.apps_incluses_ids || []).some((id) => String(id) === APP_EPS_CLASSE_CI)
    );
  }, [abonnements]);

  const accesEpsBacJv = useMemo(() => {
    return abonnements.some(
      (a) =>
        a.statut === 'actif' &&
        (a.apps_incluses_ids || []).some((id) => String(id) === APP_EPS_BAC_JV)
    );
  }, [abonnements]);

  const accesEpsClasseJv = useMemo(() => {
    return abonnements.some(
      (a) =>
        a.statut === 'actif' &&
        (a.apps_incluses_ids || []).some((id) => String(id) === APP_EPS_CLASSE_JV)
    );
  }, [abonnements]);

  const liensSidebar = useMemo(() => {
    const L = [
      { to: '/tableau-de-bord', label: 'Accueil', icon: '🏠' },
      { to: '/choisir-abonnement', label: 'Abonnement', icon: '💳' },
      { to: '/mon-compte/profil', label: 'Mon compte', icon: '👤' },
      { to: '/mon-compte/stats', label: 'Mes stats', icon: '📊' },
    ];
    if (utilisateur?.type_utilisateur === 'admin_ecole') {
      L.push({ to: '/paiement/collectif-ecole', label: 'Paiement école', icon: '🏫' });
    }
    if (accesGestionEquipe) {
      L.push({ to: '/apps/sport/gestion-equipe', label: 'Gestion équipe', icon: '🏀' });
    }
    if (accesStatistiques) {
      L.push({ to: '/apps/sport/statistiques', label: 'Stats matchs', icon: '📈' });
    }
    if (accesEpsBacCi) {
      L.push({ to: '/apps/eps/ci/evaluation-bac', label: 'EPS BAC CI', icon: '🇨🇮' });
    }
    if (accesEpsClasseCi) {
      L.push({ to: '/apps/eps/ci/evaluation-classe', label: 'EPS classe CI', icon: '📝' });
    }
    if (accesEpsBacJv) {
      L.push({ to: '/apps/eps/jules-verne/evaluation-bac', label: 'EPS BAC JV', icon: '🎓' });
    }
    if (accesEpsClasseJv) {
      L.push({
        to: '/apps/eps/jules-verne/evaluation-classe',
        label: 'EPS classe JV',
        icon: '📗',
      });
    }
    if (utilisateur?.type_utilisateur === 'admin_central') {
      L.push({ to: '/admin/stats/revenue', label: 'Analytics', icon: '⚙️' });
    }
    if (utilisateur?.type_utilisateur === 'admin_ecole') {
      L.push({ to: '/ecole/stats', label: 'Stats école', icon: '📉' });
    }
    return L;
  }, [
    utilisateur,
    accesGestionEquipe,
    accesStatistiques,
    accesEpsBacCi,
    accesEpsClasseCi,
    accesEpsBacJv,
    accesEpsClasseJv,
  ]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar links={liensSidebar} />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
            <Link to="/" className="text-lg font-semibold text-slate-900">
              Hub
            </Link>
            <button
              type="button"
              onClick={handleDeconnexion}
              className="min-h-11 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Déconnexion
            </button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <h1 className="text-2xl font-bold text-slate-900">Tableau de bord</h1>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            to="/choisir-abonnement"
            className="inline-flex w-full min-h-12 items-center justify-center rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-orange-600 sm:w-auto"
          >
            Payer avec Wave
          </Link>
          {utilisateur?.type_utilisateur === 'admin_ecole' && (
            <Link
              to="/paiement/collectif-ecole"
              className="inline-flex rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
            >
              Paiement collectif école
            </Link>
          )}
          {accesGestionEquipe && (
            <Link
              to="/apps/sport/gestion-equipe"
              className="inline-flex rounded-xl bg-sky-700 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-sky-800"
            >
              Gestion d&apos;équipe
            </Link>
          )}
          {accesStatistiques && (
            <Link
              to="/apps/sport/statistiques"
              className="inline-flex rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-indigo-700"
            >
              Statistiques matchs
            </Link>
          )}
          {accesEpsBacCi && (
            <Link
              to="/apps/eps/ci/evaluation-bac"
              className="inline-flex rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-orange-700"
            >
              EPS — BAC ivoirien
            </Link>
          )}
          {accesEpsClasseCi && (
            <Link
              to="/apps/eps/ci/evaluation-classe"
              className="inline-flex rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-emerald-700"
            >
              EPS — Classe ivoirien
            </Link>
          )}
          {accesEpsBacJv && (
            <Link
              to="/apps/eps/jules-verne/evaluation-bac"
              className="inline-flex rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-violet-700"
            >
              EPS — BAC Jules Verne
            </Link>
          )}
          {accesEpsClasseJv && (
            <Link
              to="/apps/eps/jules-verne/evaluation-classe"
              className="inline-flex rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-teal-700"
            >
              EPS — Classe Jules Verne
            </Link>
          )}
          <Link
            to="/mon-compte/stats"
            className="inline-flex rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
          >
            Mes statistiques
          </Link>
          {utilisateur?.type_utilisateur === 'admin_central' && (
            <Link
              to="/admin/stats/revenue"
              className="inline-flex rounded-xl bg-rose-700 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-rose-800"
            >
              Analytics (admin)
            </Link>
          )}
          {utilisateur?.type_utilisateur === 'admin_ecole' && (
            <Link
              to="/ecole/stats"
              className="inline-flex rounded-xl bg-amber-700 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-amber-800"
            >
              Stats école
            </Link>
          )}
        </div>
        <p className="mt-4 text-slate-600">
          Vos abonnements et les applications auxquelles vous avez accès.
        </p>

        {erreur && (
          <div
            className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            role="alert"
          >
            {erreur}
          </div>
        )}

        {chargement && (
          <div className="mt-10 flex items-center gap-3 text-slate-600">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-sky-600 border-t-transparent" />
            Chargement…
          </div>
        )}

        {!chargement && !erreur && alertesExpiration.length > 0 && (
          <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <strong>Expiration proche :</strong>{' '}
            {alertesExpiration.map((a) => (
              <span key={a.id} className="mr-2 inline-block">
                {a.rubrique} — fin le {formatDate(a.date_fin)}
              </span>
            ))}
          </div>
        )}

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Compte connecté
          </h2>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-slate-500">Nom</dt>
              <dd className="font-medium text-slate-900">
                {utilisateur?.prenom} {utilisateur?.nom}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">E-mail</dt>
              <dd className="font-medium text-slate-900">{utilisateur?.email}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Type</dt>
              <dd className="font-medium text-slate-900">{utilisateur?.type_utilisateur}</dd>
            </div>
          </dl>
        </div>

        <section className="mt-10">
          <h2 className="text-lg font-semibold text-slate-900">Mes abonnements</h2>
          {!chargement && abonnements.length === 0 && (
            <p className="mt-3 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-8 text-center text-slate-600">
              Aucun abonnement pour l’instant. Après paiement Wave, vos accès apparaîtront ici.
            </p>
          )}
          {!chargement && abonnements.length > 0 && (
            <ul className="mt-4 space-y-4">
              {abonnements.map((ab) => (
                <li
                  key={ab.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                        {ab.rubrique}
                      </span>
                      <span className="ml-2 inline-flex rounded-full bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-800">
                        {ab.statut}
                      </span>
                      <p className="mt-2 font-medium text-slate-900">
                        {ab.type_abonnement === 'formule' ? 'Formule' : 'À la carte'} ·{' '}
                        {ab.programme === 'ivoirien' ? 'Programme ivoirien' : 'Programme français'}
                        {ab.sport ? ` · ${ab.sport}` : ''}
                      </p>
                      {ab.ecole && (
                        <p className="mt-1 text-sm text-slate-600">
                          École : {ab.ecole.nom} ({ab.ecole.domaine_email})
                        </p>
                      )}
                      <p className="mt-2 text-sm text-slate-600">
                        Du {formatDate(ab.date_debut)} au {formatDate(ab.date_fin)}
                        {ab.statut === 'actif' && (
                          <span className="ml-2 text-slate-500">
                            (
                            {joursRestants(ab.date_fin) !== null && joursRestants(ab.date_fin) >= 0
                              ? `${joursRestants(ab.date_fin)} j. restants`
                              : 'expiré'}
                            )
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="text-right text-sm text-slate-600">
                      {Number(ab.montant_paye).toLocaleString('fr-CI')} FCFA
                    </div>
                  </div>

                  {ab.applications?.length > 0 && (
                    <div className="mt-4 border-t border-slate-100 pt-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Applications incluses
                      </p>
                      <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                        {ab.applications.map((app) => (
                          <li
                            key={app.id}
                            className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-3"
                          >
                            <span className="text-2xl leading-none" aria-hidden>
                              {app.icone || '🔗'}
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-slate-900">{app.nom}</p>
                              <p className="truncate text-xs text-slate-500">
                                Chemin prévu : {app.url_app}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mt-12">
          <h2 className="text-lg font-semibold text-slate-900">Catalogue Hub</h2>
          <p className="mt-2 text-sm text-slate-600">
            Applications proposées sur la plateforme (tarifs à régler via Wave — module suivant).
          </p>
          {!chargement && catalogue.length > 0 && (
            <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                  <tr>
                    <th className="px-4 py-3">App</th>
                    <th className="px-4 py-3">Rubrique</th>
                    <th className="px-4 py-3 text-right">Prix à la carte</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {catalogue.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/80">
                      <td className="px-4 py-3">
                        <span className="mr-2">{app.icone}</span>
                        <span className="font-medium text-slate-900">{app.nom}</span>
                        {app.specifique_ecole && (
                          <span className="ml-2 rounded bg-purple-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-purple-800">
                            École
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{app.rubrique}</td>
                      <td className="px-4 py-3 text-right font-medium text-slate-900">
                        {Number(app.prix_individuel).toLocaleString('fr-CI')} FCFA
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
        </main>
      </div>

      {utilisateur && utilisateur.onboarding_complete === false && (
        <Onboarding utilisateur={utilisateur} />
      )}
    </div>
  );
}
