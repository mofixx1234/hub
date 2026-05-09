import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { RoleRoute } from './components/RoleRoute.jsx';
import { useAuth } from './context/AuthContext.jsx';
import { Landing } from './pages/Landing.jsx';
import { ComparerOffres } from './pages/ComparerOffres.jsx';
import { ChoisirAbonnement } from './pages/ChoisirAbonnement.jsx';
import { InfoLegale } from './pages/InfoLegale.jsx';
import { Connexion } from './pages/Connexion.jsx';
import { Inscription } from './pages/Inscription.jsx';
import { TableauDeBord } from './pages/TableauDeBord.jsx';
import { PaiementAbonnement } from './pages/PaiementAbonnement.jsx';
import { PaiementReussi } from './pages/PaiementReussi.jsx';
import { PaiementEchec } from './pages/PaiementEchec.jsx';
import { MotDePasseOublie } from './pages/MotDePasseOublie.jsx';
import { ReinitialiserMotDePasse } from './pages/ReinitialiserMotDePasse.jsx';
import { PaiementCollectifEcole } from './pages/PaiementCollectifEcole.jsx';
import { GestionEquipe } from './pages/GestionEquipe.jsx';
import { Statistiques } from './pages/Statistiques.jsx';
import { EvaluationBacCi } from './pages/EvaluationBacCi.jsx';
import { EvaluationClasseCi } from './pages/EvaluationClasseCi.jsx';
import { EvaluationBacJv } from './pages/EvaluationBacJv.jsx';
import { EvaluationClasseJv } from './pages/EvaluationClasseJv.jsx';
import { EvaluationBacFrLibre } from './pages/EvaluationBacFrLibre.jsx';
import { EvaluationClasseFrLibre } from './pages/EvaluationClasseFrLibre.jsx';
import { StatsRevenue } from './pages/admin/StatsRevenue.jsx';
import { StatsUtilisateurs } from './pages/admin/StatsUtilisateurs.jsx';
import { StatsAbonnements } from './pages/admin/StatsAbonnements.jsx';
import { StatsApps } from './pages/admin/StatsApps.jsx';
import { EcoleStats } from './pages/admin/EcoleStats.jsx';
import { BaremesAdmin } from './pages/admin/BaremesAdmin.jsx';
import { MonStats } from './pages/MonStats.jsx';
import { Profil } from './pages/compte/Profil.jsx';
import { Preferences } from './pages/compte/Preferences.jsx';
import { MesDonnees } from './pages/compte/MesDonnees.jsx';
import { Corbeille } from './pages/compte/Corbeille.jsx';
import { SupprimerCompte } from './pages/compte/SupprimerCompte.jsx';
import { Abonnements } from './pages/compte/Abonnements.jsx';
import { Paiements } from './pages/compte/Paiements.jsx';
import { ChangerMotDePasse } from './pages/compte/ChangerMotDePasse.jsx';
import { EvalClasseLayout } from './apps/eval-classe/EvalClasseLayout.jsx';
import { EvalClasseHome } from './apps/eval-classe/EvalClasseHome.jsx';
import { GererClasses } from './apps/eval-classe/GererClasses.jsx';
import { ListeElevesClasse } from './apps/eval-classe/ListeElevesClasse.jsx';
import { SaisirNoteClasse } from './apps/eval-classe/SaisirNoteClasse.jsx';
import { MoyennesClasse } from './apps/eval-classe/MoyennesClasse.jsx';
import { BulletinEleve } from './apps/eval-classe/BulletinEleve.jsx';
import { PageNonTrouvee } from './pages/PageNonTrouvee.jsx';
import { ErreurServeur } from './pages/ErreurServeur.jsx';

export default function App() {
  const { pret } = useAuth();

  if (!pret) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-sky-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/comparer-offres" element={<ComparerOffres />} />
      <Route path="/erreur-serveur" element={<ErreurServeur />} />
      <Route path="/cgu" element={<InfoLegale page="cgu" />} />
      <Route path="/confidentialite" element={<InfoLegale page="confidentialite" />} />
      <Route path="/contact" element={<InfoLegale page="contact" />} />
      <Route path="/connexion" element={<Connexion />} />
      <Route path="/mot-de-passe-oublie" element={<MotDePasseOublie />} />
      <Route path="/reinitialiser-mot-de-passe" element={<ReinitialiserMotDePasse />} />
      <Route path="/inscription" element={<Inscription />} />
      <Route
        path="/tableau-de-bord"
        element={
          <ProtectedRoute>
            <TableauDeBord />
          </ProtectedRoute>
        }
      />
      <Route
        path="/paiement/abonnement"
        element={
          <ProtectedRoute>
            <PaiementAbonnement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/choisir-abonnement"
        element={
          <ProtectedRoute>
            <ChoisirAbonnement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/paiement/collectif-ecole"
        element={
          <ProtectedRoute>
            <PaiementCollectifEcole />
          </ProtectedRoute>
        }
      />
      <Route path="/paiement/reussi" element={<PaiementReussi />} />
      <Route path="/paiement/echec" element={<PaiementEchec />} />
      <Route
        path="/apps/sport/gestion-equipe"
        element={
          <ProtectedRoute>
            <GestionEquipe />
          </ProtectedRoute>
        }
      />
      <Route
        path="/apps/sport/statistiques"
        element={
          <ProtectedRoute>
            <Statistiques />
          </ProtectedRoute>
        }
      />
      <Route
        path="/apps/eps/ci/evaluation-bac"
        element={
          <ProtectedRoute>
            <EvaluationBacCi />
          </ProtectedRoute>
        }
      />
      <Route
        path="/apps/eps/ci/evaluation-classe"
        element={
          <ProtectedRoute>
            <EvaluationClasseCi />
          </ProtectedRoute>
        }
      />
      <Route
        path="/apps/eps/jules-verne/evaluation-bac"
        element={
          <ProtectedRoute>
            <EvaluationBacJv />
          </ProtectedRoute>
        }
      />
      <Route
        path="/apps/eps/jules-verne/evaluation-classe"
        element={
          <ProtectedRoute>
            <EvaluationClasseJv />
          </ProtectedRoute>
        }
      />
      <Route
        path="/apps/eps/fr-libre/evaluation-bac"
        element={
          <ProtectedRoute>
            <EvaluationBacFrLibre />
          </ProtectedRoute>
        }
      />
      <Route
        path="/apps/eps/fr-libre/evaluation-classe"
        element={
          <ProtectedRoute>
            <EvaluationClasseFrLibre />
          </ProtectedRoute>
        }
      />
      <Route
        path="/apps/eval-classe"
        element={
          <ProtectedRoute>
            <EvalClasseLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<EvalClasseHome />} />
        <Route path="classes" element={<GererClasses />} />
        <Route path="classe/:classeId" element={<ListeElevesClasse />} />
        <Route path="classe/:classeId/saisie" element={<SaisirNoteClasse />} />
        <Route path="classe/:classeId/moyennes" element={<MoyennesClasse />} />
        <Route path="eleve/:eleveId/bulletin" element={<BulletinEleve />} />
      </Route>
      <Route
        path="/admin/stats/revenue"
        element={
          <RoleRoute types={['admin_central']}>
            <StatsRevenue />
          </RoleRoute>
        }
      />
      <Route
        path="/admin/stats/utilisateurs"
        element={
          <RoleRoute types={['admin_central']}>
            <StatsUtilisateurs />
          </RoleRoute>
        }
      />
      <Route
        path="/admin/stats/abonnements"
        element={
          <RoleRoute types={['admin_central']}>
            <StatsAbonnements />
          </RoleRoute>
        }
      />
      <Route
        path="/admin/stats/apps"
        element={
          <RoleRoute types={['admin_central']}>
            <StatsApps />
          </RoleRoute>
        }
      />
      <Route
        path="/admin/baremes"
        element={
          <RoleRoute types={['admin_central']}>
            <BaremesAdmin />
          </RoleRoute>
        }
      />
      <Route
        path="/ecole/stats"
        element={
          <RoleRoute types={['admin_ecole']}>
            <EcoleStats />
          </RoleRoute>
        }
      />
      <Route
        path="/mon-compte/stats"
        element={
          <ProtectedRoute>
            <MonStats />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mon-compte/profil"
        element={
          <ProtectedRoute>
            <Profil />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mon-compte/preferences"
        element={
          <ProtectedRoute>
            <Preferences />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mon-compte/donnees"
        element={
          <ProtectedRoute>
            <MesDonnees />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mon-compte/corbeille"
        element={
          <ProtectedRoute>
            <Corbeille />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mon-compte/paiements"
        element={
          <ProtectedRoute>
            <Paiements />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mon-compte/abonnements"
        element={
          <ProtectedRoute>
            <Abonnements />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mon-compte/supprimer"
        element={
          <ProtectedRoute>
            <SupprimerCompte />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mon-compte/mot-de-passe"
        element={
          <ProtectedRoute>
            <ChangerMotDePasse />
          </ProtectedRoute>
        }
      />
      <Route path="/admin/stats" element={<Navigate to="/admin/stats/revenue" replace />} />
      <Route path="*" element={<PageNonTrouvee />} />
    </Routes>
  );
}
