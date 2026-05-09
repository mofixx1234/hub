import { Link } from 'react-router-dom';
import { Navbar } from '../components/Layout/Navbar.jsx';
import { Button } from '../components/ui/Button.jsx';
import { useAuth } from '../context/AuthContext.jsx';

/** Route catch-all — page 404. */
export function PageNonTrouvee() {
  const { connecte } = useAuth();

  return (
    <div className="flex min-h-screen flex-col bg-hub-dark font-sans text-hub-text">
      <Navbar variant="public" connecte={connecte} />
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <p className="text-6xl sm:text-7xl" aria-hidden>
          🔍
        </p>
        <p className="mt-6 font-mono text-sm text-hub-muted">404</p>
        <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Page introuvable</h1>
        <p className="mt-3 max-w-md text-sm text-hub-muted">
          Cette page n&apos;existe pas ou a été déplacée.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link to="/">
            <Button type="button" variant="outline" className="w-full min-w-[200px] sm:w-auto">
              ← Retour à l&apos;accueil
            </Button>
          </Link>
          {connecte && (
            <Link to="/tableau-de-bord">
              <Button type="button" className="w-full min-w-[200px] sm:w-auto">
                Mon tableau de bord
              </Button>
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}
