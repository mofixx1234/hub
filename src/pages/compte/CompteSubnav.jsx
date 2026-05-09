import { NavLink } from 'react-router-dom';

const tabCls =
  'rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800';
const activeCls = 'bg-sky-100 text-sky-900 dark:bg-sky-900/40 dark:text-sky-100';

const LINKS = [
  { to: '/mon-compte/profil', label: 'Profil' },
  { to: '/mon-compte/preferences', label: 'Préférences' },
  { to: '/mon-compte/donnees', label: 'Mes données' },
  { to: '/mon-compte/corbeille', label: 'Corbeille' },
  { to: '/mon-compte/paiements', label: 'Paiements' },
  { to: '/mon-compte/abonnements', label: 'Abonnements' },
];

export function CompteSubnav() {
  return (
    <nav className="flex flex-wrap gap-2 border-b border-slate-200 pb-4 dark:border-slate-700">
      {LINKS.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `${tabCls} ${isActive ? activeCls : ''}`}
        >
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
