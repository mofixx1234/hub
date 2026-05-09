import { Link, Outlet } from 'react-router-dom';

export function EvalClasseLayout() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
            <Link to="/tableau-de-bord" className="text-sky-700 hover:underline dark:text-sky-400">
              ← Tableau de bord
            </Link>
            <Link
              to="/apps/eval-classe"
              className="text-slate-900 hover:text-sky-700 dark:text-white dark:hover:text-sky-400"
            >
              Évaluation classe EPS
            </Link>
            <Link
              to="/apps/eval-classe/classes"
              className="text-slate-600 hover:text-sky-700 dark:text-slate-300"
            >
              Mes classes
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
