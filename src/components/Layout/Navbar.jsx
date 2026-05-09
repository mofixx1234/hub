import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const linkCls =
  'rounded-lg px-3 py-2 text-sm font-medium text-hub-text/90 hover:bg-white/5 hover:text-white';

/**
 * Barre de navigation — mobile-first, drawer sur petit écran.
 * @param {{ variant?: 'public' | 'app'; connecte?: boolean }} props
 */
export function Navbar({ variant = 'public', connecte = false }) {
  const [menuOuvert, setMenuOuvert] = useState(false);

  const liensPublic = (
    <>
      <a href="#fonctionnalites" className={linkCls} onClick={() => setMenuOuvert(false)}>
        Fonctionnalités
      </a>
      <a href="#rubriques" className={linkCls} onClick={() => setMenuOuvert(false)}>
        Rubriques
      </a>
      <a href="#ecoles" className={linkCls} onClick={() => setMenuOuvert(false)}>
        Écoles
      </a>
    </>
  );

  const liensApp = (
    <>
      <NavLink
        to="/tableau-de-bord"
        className={({ isActive }) =>
          `${linkCls} ${isActive ? 'bg-white/10 text-white' : ''}`
        }
        onClick={() => setMenuOuvert(false)}
      >
        Tableau de bord
      </NavLink>
      <NavLink
        to="/choisir-abonnement"
        className={({ isActive }) =>
          `${linkCls} ${isActive ? 'bg-white/10 text-white' : ''}`
        }
        onClick={() => setMenuOuvert(false)}
      >
        Abonnement
      </NavLink>
    </>
  );

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-hub-border bg-hub-dark/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <button
            type="button"
            className="hub-focus-ring rounded-lg p-2 text-hub-text lg:hidden"
            aria-expanded={menuOuvert}
            aria-label="Ouvrir le menu"
            onClick={() => setMenuOuvert(true)}
          >
            <span className="text-xl" aria-hidden>
              ☰
            </span>
          </button>

          <Link
            to="/"
            className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2 font-bold tracking-tight text-white lg:static lg:translate-x-0"
          >
            <span className="text-xl">◆</span>
            <span className="hidden sm:inline">Hub</span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {variant === 'public' && !connecte && liensPublic}
            {connecte && liensApp}
          </nav>

          <div className="flex items-center gap-2">
            {!connecte ? (
              <>
                <Link
                  to="/connexion"
                  className="hidden rounded-lg px-3 py-2 text-sm font-medium text-hub-muted hover:text-white sm:inline"
                >
                  Connexion
                </Link>
                <Link
                  to="/inscription"
                  className="rounded-xl bg-hub-primary px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-hub-primary/20 hover:bg-hub-primary-dark"
                >
                  S&apos;inscrire
                </Link>
              </>
            ) : (
              <Link
                to="/tableau-de-bord"
                className="rounded-xl border border-hub-border bg-hub-surface px-4 py-2 text-sm font-medium text-hub-text hover:bg-hub-surface2"
              >
                Mon espace
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Drawer mobile */}
      <div
        className={`fixed inset-0 z-[60] lg:hidden ${menuOuvert ? '' : 'pointer-events-none'}`}
        aria-hidden={!menuOuvert}
      >
        <button
          type="button"
          className={`absolute inset-0 bg-black/60 transition-opacity ${menuOuvert ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setMenuOuvert(false)}
          aria-label="Fermer le menu"
        />
        <div
          className={`absolute left-0 top-0 flex h-full w-[min(20rem,88vw)] flex-col border-r border-hub-border bg-hub-surface p-4 shadow-2xl transition-transform ${menuOuvert ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="mb-6 flex items-center justify-between">
            <span className="font-bold text-white">Menu</span>
            <button
              type="button"
              className="rounded-lg p-2 text-hub-muted hover:bg-hub-surface2"
              onClick={() => setMenuOuvert(false)}
            >
              ✕
            </button>
          </div>
          <div className="flex flex-col gap-1">
            {variant === 'public' && !connecte && liensPublic}
            {connecte && liensApp}
            {!connecte && (
              <Link
                to="/connexion"
                className={linkCls}
                onClick={() => setMenuOuvert(false)}
              >
                Connexion
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
