const types = {
  info: 'border-hub-border bg-hub-surface2 text-hub-text',
  success: 'border-hub-success/40 bg-hub-success/10 text-hub-success',
  warning: 'border-hub-warning/40 bg-hub-warning/10 text-hub-warning',
  danger: 'border-hub-danger/40 bg-hub-danger/10 text-hub-danger',
};

export function Alert({ children, type = 'info', className = '', titre }) {
  return (
    <div
      role="alert"
      className={`rounded-xl border px-4 py-3 text-sm ${types[type] || types.info} ${className}`}
    >
      {titre && <p className="mb-1 font-semibold">{titre}</p>}
      {children}
    </div>
  );
}
