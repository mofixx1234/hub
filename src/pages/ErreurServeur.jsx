import { Navbar } from '../components/Layout/Navbar.jsx';
import { Button } from '../components/ui/Button.jsx';

/** Erreur réseau / serveur injoignable — peut être ouverte via redirection depuis le client API. */
export function ErreurServeur() {
  function reessayer() {
    window.location.reload();
  }

  return (
    <div className="flex min-h-screen flex-col bg-hub-dark font-sans text-hub-text">
      <Navbar variant="public" connecte={false} />
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <p className="text-6xl sm:text-7xl" aria-hidden>
          🔌
        </p>
        <h1 className="mt-8 text-2xl font-bold text-white sm:text-3xl">Connexion interrompue</h1>
        <p className="mt-4 max-w-md text-sm text-hub-muted">
          Impossible de joindre le serveur. Vérifiez votre connexion internet.
        </p>
        <div className="mt-10">
          <Button type="button" size="lg" onClick={reessayer}>
            Réessayer
          </Button>
        </div>
      </main>
    </div>
  );
}
