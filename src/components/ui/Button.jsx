/** Bouton — variantes alignées sur le design system Hub. */
const variants = {
  primary:
    'bg-hub-primary text-white hover:bg-hub-primary-dark shadow-lg shadow-hub-primary/25 disabled:opacity-50',
  secondary:
    'bg-hub-secondary text-white hover:opacity-90 shadow-md disabled:opacity-50',
  outline:
    'border-2 border-hub-border bg-transparent text-hub-text hover:bg-hub-surface2 disabled:opacity-50',
  ghost: 'bg-transparent text-hub-text hover:bg-white/5 disabled:opacity-50',
  danger: 'bg-hub-danger text-white hover:opacity-90 disabled:opacity-50',
};

const sizes = {
  sm: 'min-h-10 px-3 py-2 text-sm rounded-lg',
  md: 'min-h-12 px-5 py-3 text-sm font-semibold rounded-xl',
  lg: 'min-h-14 px-6 py-3.5 text-base font-semibold rounded-xl w-full sm:w-auto',
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  disabled,
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 transition-colors hub-focus-ring ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
