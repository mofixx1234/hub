/** Tableau responsive — défilement horizontal sur mobile. */
export function Table({ children, className = '' }) {
  return (
    <div className={`overflow-x-auto rounded-xl border border-hub-border ${className}`}>
      <table className="min-w-full divide-y divide-hub-border text-left text-sm">{children}</table>
    </div>
  );
}

export function THead({ children }) {
  return (
    <thead className="bg-hub-surface2 text-xs font-semibold uppercase tracking-wide text-hub-muted">
      {children}
    </thead>
  );
}

export function TBody({ children }) {
  return <tbody className="divide-y divide-hub-border bg-hub-surface">{children}</tbody>;
}

export function Tr({ children, className = '' }) {
  return <tr className={`hover:bg-hub-surface2/50 ${className}`}>{children}</tr>;
}

export function Th({ children, className = '' }) {
  return <th className={`px-4 py-3 ${className}`}>{children}</th>;
}

export function Td({ children, className = '' }) {
  return <td className={`px-4 py-3 text-hub-text ${className}`}>{children}</td>;
}
