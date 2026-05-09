import { Link } from 'react-router-dom';

export function Footer({ sombre = true }) {
  const base = sombre
    ? 'border-hub-border bg-hub-surface text-hub-muted'
    : 'border-slate-200 bg-white text-slate-600';

  return (
    <footer className={`mt-auto border-t ${base}`}>
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="flex items-center gap-2 text-lg font-bold text-white">
            <span aria-hidden>◆</span> Hub
          </p>
          <p className="mt-2 max-w-xs text-sm">
            La plateforme tout-en-un pour le sport et l&apos;EPS en Côte d&apos;Ivoire.
          </p>
        </div>
        <div className="flex flex-wrap gap-8 text-sm">
          <div>
            <p className="mb-2 font-semibold text-hub-text">Légal</p>
            <ul className="space-y-2">
              <li>
                <Link to="/cgu" className="hover:text-hub-primary">
                  CGU
                </Link>
              </li>
              <li>
                <Link to="/confidentialite" className="hover:text-hub-primary">
                  Politique de confidentialité
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="mb-2 font-semibold text-hub-text">Contact</p>
            <Link to="/contact" className="hover:text-hub-primary">
              Nous écrire
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-hub-border py-4 text-center text-xs text-hub-muted">
        © 2026 Hub — Côte d&apos;Ivoire 🇨🇮
      </div>
    </footer>
  );
}
