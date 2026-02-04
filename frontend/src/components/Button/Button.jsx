import clsx from 'clsx';

const baseStyles =
  'btn transition-all duration-150';

const variants = {
  primary: 'btn-primary',
  ghost: 'btn-ghost',
  subtle: 'bg-bg-subtle text-text-secondary hover:bg-border',
  badge: 'badge-neutral text-xs py-1 px-2',
  danger: 'btn-danger',
  accent: 'btn-accent',
};

const sizes = {
  sm: 'btn-sm',
  md: '',
  lg: 'btn-lg',
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
