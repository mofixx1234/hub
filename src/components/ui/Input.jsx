/** Champ formulaire — grande zone tactile sur mobile. */
export function Input({
  label,
  erreur,
  id,
  className = '',
  wrapperClass = '',
  hint,
  ...props
}) {
  const inputId = id || props.name;
  return (
    <div className={wrapperClass}>
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-hub-text">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`hub-focus-ring w-full min-h-12 rounded-xl border border-hub-border bg-hub-surface2 px-4 text-base text-hub-text placeholder:text-hub-muted focus:border-hub-primary ${erreur ? 'border-hub-danger' : ''} ${className}`}
        {...props}
      />
      {hint && !erreur && <p className="mt-1 text-xs text-hub-muted">{hint}</p>}
      {erreur && <p className="mt-1 text-xs text-hub-danger">{erreur}</p>}
    </div>
  );
}
