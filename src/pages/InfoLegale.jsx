import { Link } from 'react-router-dom';
import { Navbar } from '../components/Layout/Navbar.jsx';
import { Footer } from '../components/Layout/Footer.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const CONTENUS = {
  cgu: {
    titre: 'Conditions générales d’utilisation',
    corps: (
      <>
        <p className="text-hub-muted">
          Les présentes CGU encadrent l’utilisation de la plateforme Hub. Version provisoire — à faire
          valider par votre conseil juridique avant mise en production.
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-hub-text">
          <li>Compte personnel et usage conforme à la loi ivoirienne.</li>
          <li>Paiements traités via Wave ; les conditions Wave s’appliquent aux transactions.</li>
          <li>Données hébergées et traitées selon notre politique de confidentialité.</li>
        </ul>
      </>
    ),
  },
  confidentialite: {
    titre: 'Politique de confidentialité',
    corps: (
      <>
        <p className="text-hub-muted">
          Nous collectons les données nécessaires au fonctionnement du service (compte, abonnements,
          journaux de sécurité). Texte provisoire — compléter selon votre DPO ou avocat.
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-hub-text">
          <li>Base légale : exécution du contrat et intérêt légitime (sécurité).</li>
          <li>Durée de conservation : durée du compte + obligations légales.</li>
          <li>Droits : accès, rectification, suppression — contact : voir page Contact.</li>
        </ul>
      </>
    ),
  },
  contact: {
    titre: 'Contact',
    corps: (
      <>
        <p className="text-hub-muted">
          Pour toute question commerciale ou support : indiquez ici l’e-mail et le numéro de votre
          équipe Hub une fois définis.
        </p>
        <p className="mt-4 rounded-xl border border-hub-border bg-hub-surface2 p-4 font-mono text-sm text-hub-text">
          contact@hub.ci (exemple)
        </p>
      </>
    ),
  },
};

export function InfoLegale({ page }) {
  const { connecte, pret } = useAuth();
  const bloc = CONTENUS[page] || CONTENUS.contact;

  return (
    <div className="hub-surface flex min-h-screen flex-col">
      <Navbar variant="public" connecte={pret && connecte} />
      <main className="mx-auto max-w-3xl flex-1 px-4 py-12 sm:px-6">
        <Link to="/" className="text-sm text-hub-primary hover:underline">
          ← Accueil
        </Link>
        <h1 className="mt-6 text-3xl font-bold text-white">{bloc.titre}</h1>
        <div className="mt-8 space-y-4 text-sm leading-relaxed">{bloc.corps}</div>
      </main>
      <Footer />
    </div>
  );
}
