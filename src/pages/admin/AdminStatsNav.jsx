import { Link } from 'react-router-dom';

const LIENS = [
  ['/admin/stats/revenue', 'Revenue'],
  ['/admin/stats/utilisateurs', 'Utilisateurs'],
  ['/admin/stats/abonnements', 'Abonnements'],
  ['/admin/stats/apps', 'Applications'],
  ['/admin/baremes', 'Barèmes'],
];

export function AdminStatsNav() {
  return (
    <nav className="mb-8 flex flex-wrap gap-2 border-b border-slate-200 pb-4">
      {LIENS.map(([href, label]) => (
        <Link
          key={href}
          to={href}
          className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-200"
        >
          {label}
        </Link>
      ))}
      <Link
        to="/tableau-de-bord"
        className="ml-auto text-sm font-medium text-sky-700 hover:underline"
      >
        ← Tableau de bord
      </Link>
    </nav>
  );
}
