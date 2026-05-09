/** Carte surface sombre — bordure design system. */
export function Card({ children, className = '', padding = 'p-5', as: Comp = 'div' }) {
  return (
    <Comp
      className={`rounded-2xl border border-hub-border bg-hub-surface shadow-xl ${padding} ${className}`}
    >
      {children}
    </Comp>
  );
}
