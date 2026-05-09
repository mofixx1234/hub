const styles = {
  default: 'bg-hub-surface2 text-hub-muted border-hub-border',
  primary: 'bg-hub-primary/15 text-hub-primary border-hub-primary/40',
  success: 'bg-hub-success/15 text-hub-success border-hub-success/40',
  warning: 'bg-hub-warning/15 text-hub-warning border-hub-warning/40',
  danger: 'bg-hub-danger/15 text-hub-danger border-hub-danger/40',
  secondary: 'bg-hub-secondary/15 text-hub-secondary border-hub-secondary/40',
};

export function Badge({ children, variant = 'default', className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${styles[variant] || styles.default} ${className}`}
    >
      {children}
    </span>
  );
}
