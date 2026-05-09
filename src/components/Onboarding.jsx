import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Modal } from './ui/Modal.jsx';
import { Button } from './ui/Button.jsx';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * Tour guidé premier login — affiché si onboarding_complete === false.
 * Étape 1 obligatoire : acceptation CGU / confidentialité (pas de contournement).
 */
export function Onboarding({ utilisateur }) {
  const { appliquerProfil, rafraichirProfil } = useAuth();
  const [etape, setEtape] = useState(1);
  const [chargement, setChargement] = useState(false);
  const [cguAcceptees, setCguAcceptees] = useState(false);
  const [erreurCgu, setErreurCgu] = useState('');

  async function terminer() {
    setChargement(true);
    try {
      const { data } = await api.post('/api/auth/onboarding/terminer');
      if (data.utilisateur) appliquerProfil(data.utilisateur);
      else await rafraichirProfil();
    } catch {
      await rafraichirProfil();
    } finally {
      setChargement(false);
    }
  }

  async function continuerApresCgu() {
    if (!cguAcceptees) return;
    setErreurCgu('');
    setChargement(true);
    try {
      await api.post('/api/auth/accepter-cgu', {
        accepted_at: new Date().toISOString(),
      });
      setEtape(2);
    } catch (err) {
      setErreurCgu(
        err.response?.data?.erreur || err.message || 'Impossible d’enregistrer votre acceptation.'
      );
    } finally {
      setChargement(false);
    }
  }

  if (utilisateur?.onboarding_complete) return null;

  const contenu = {
    1: {
      titre: 'Avant de commencer 📋',
      corps: (
        <>
          <p className="text-hub-muted">
            En utilisant cette plateforme, vous acceptez nos conditions d&apos;utilisation et notre
            politique de confidentialité.
          </p>
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
            <Link
              to="/cgu"
              className="font-medium text-hub-primary underline underline-offset-2 hover:opacity-90"
            >
              Conditions d&apos;utilisation
            </Link>
            <Link
              to="/confidentialite"
              className="font-medium text-hub-primary underline underline-offset-2 hover:opacity-90"
            >
              Politique de confidentialité
            </Link>
          </div>
          {erreurCgu && (
            <p className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {erreurCgu}
            </p>
          )}
          <label
            className={`mt-6 flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-3 transition-colors ${
              cguAcceptees
                ? 'border-[#ff6b35]/60 bg-[#ff6b35]/10'
                : 'border-hub-border bg-hub-surface2/80'
            }`}
          >
            <input
              type="checkbox"
              checked={cguAcceptees}
              onChange={(e) => setCguAcceptees(e.target.checked)}
              className="peer mt-0.5 min-h-6 min-w-6 shrink-0 cursor-pointer rounded border-hub-border accent-[#ff6b35]"
              style={{ accentColor: '#ff6b35' }}
            />
            <span
              className={`min-h-[24px] flex-1 text-sm leading-snug ${
                cguAcceptees ? 'text-white' : 'text-hub-muted'
              }`}
            >
              J&apos;ai lu et j&apos;accepte les conditions d&apos;utilisation et la politique de
              confidentialité
            </span>
          </label>
          <div className="mt-6 flex justify-end">
            <Button
              type="button"
              onClick={continuerApresCgu}
              disabled={!cguAcceptees || chargement}
              className={
                !cguAcceptees || chargement ? '!opacity-40 !cursor-not-allowed grayscale-[0.3]' : ''
              }
            >
              {chargement ? '…' : 'Continuer'}
            </Button>
          </div>
        </>
      ),
    },
    2: {
      titre: 'Bienvenue ! 👋',
      corps: (
        <>
          <p className="text-hub-muted">
            Vous venez de créer votre compte. Laissez-nous vous guider en quelques étapes pour tirer
            le meilleur parti du Hub.
          </p>
          <div className="mt-6 flex justify-end">
            <Button type="button" onClick={() => setEtape(3)}>
              Commencer
            </Button>
          </div>
        </>
      ),
    },
    3: {
      titre: 'Choisissez votre rubrique',
      corps: (
        <>
          <p className="text-hub-muted">
            Vous êtes dans un <strong className="text-hub-text">club de sport</strong> ? Ou{' '}
            <strong className="text-hub-text">professeur d&apos;EPS</strong> ? Depuis le tableau de
            bord, souscrivez à la rubrique qui vous correspond (Sport ou Enseignement).
          </p>
          <div className="mt-6 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setEtape(2)}>
              Retour
            </Button>
            <Button type="button" onClick={() => setEtape(4)}>
              Suivant
            </Button>
          </div>
        </>
      ),
    },
    4: {
      titre: 'Payez avec Wave',
      corps: (
        <>
          <p className="text-hub-muted">
            Une fois votre rubrique choisie, payez facilement via{' '}
            <strong className="text-hub-text">Wave</strong> (Orange Money, Moov et autres moyens
            Mobile Money en Côte d&apos;Ivoire).
          </p>
          <div className="mt-6 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setEtape(3)}>
              Retour
            </Button>
            <Button type="button" onClick={() => setEtape(5)}>
              Suivant
            </Button>
          </div>
        </>
      ),
    },
    5: {
      titre: 'C\'est parti ! 🚀',
      corps: (
        <>
          <p className="text-hub-muted">
            Vos applications seront accessibles depuis ce tableau de bord dès que le paiement est
            confirmé. Bonne utilisation du Hub !
          </p>
          <div className="mt-6 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setEtape(4)}>
              Retour
            </Button>
            <Button type="button" onClick={terminer} disabled={chargement}>
              {chargement ? '…' : 'Terminer'}
            </Button>
          </div>
        </>
      ),
    },
  };

  const bloc = contenu[etape];
  if (!bloc) return null;

  return (
    <Modal
      ouvert
      fermable={false}
      titre={bloc.titre}
      onFermer={() => {}}
      taille="md"
      enfants={bloc.corps}
    />
  );
}
