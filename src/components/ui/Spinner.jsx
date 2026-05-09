export function Spinner({ className = 'h-8 w-8', label = 'Chargement' }) {
  return (
    <span className={`inline-flex items-center justify-center ${className}`} role="status">
      <span className="sr-only">{label}</span>
      <span className="block h-full w-full animate-spin rounded-full border-2 border-hub-primary border-t-transparent" />
    </span>
  );
}
