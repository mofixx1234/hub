import { NavLink } from 'react-router-dom';

const itemCls =
  'flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-hub-muted transition-colors hover:bg-hub-surface2 hover:text-hub-text';

const activeCls = 'bg-hub-primary/15 text-hub-primary hover:text-hub-primary';

/**
 * Barre latérale dashboard — visible à partir de lg.
 */
export function Sidebar({ links }) {
  return (
    <aside className="hidden min-h-screen w-56 shrink-0 flex-col border-r border-hub-border bg-hub-surface py-6 lg:flex">
      <nav className="flex flex-col gap-1 px-3">
        {links.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `${itemCls} ${isActive ? activeCls : ''}`}
            end={to === '/tableau-de-bord'}
          >
            <span className="text-lg" aria-hidden>
              {icon}
            </span>
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
