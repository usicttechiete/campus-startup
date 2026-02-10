import clsx from 'clsx';

const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-200 outline-none';

const variants = {
  primary: clsx(
    'bg-primary text-white shadow-sm',
    'hover:bg-primary-900',
    'active:scale-98',
    'focus:ring-4 focus:ring-primary-soft'
  ),
  secondary: clsx(
    'bg-white text-primary border border-primary',
    'hover:bg-primary-50',
    'focus:ring-4 focus:ring-primary-soft'
  ),
  ghost: clsx(
    'bg-transparent text-text-secondary',
    'hover:bg-bg-subtle',
    'focus:ring-4 focus:ring-primary-soft'
  ),
  danger: clsx(
    'bg-danger text-white',
    'hover:bg-red-700',
    'focus:ring-4 focus:ring-danger-soft'
  ),
  subtle: 'bg-bg-subtle text-text-secondary hover:bg-border',
  badge: 'badge-neutral text-xs py-1 px-2',
  accent: 'bg-accent text-white hover:bg-accent/90',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  ...props
}) => {
  return (
    <button
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
