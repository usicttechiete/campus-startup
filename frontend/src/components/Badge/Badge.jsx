import clsx from 'clsx';

const variants = {
  primary: 'badge-primary',
  secondary: 'badge-secondary',
  accent: 'badge-accent',
  success: 'badge-success',
  warning: 'badge-warning',
  danger: 'badge-danger',
  neutral: 'badge-neutral',
  trust: 'badge-accent',
  level: 'badge-secondary',
};

const Badge = ({ children, variant = 'neutral', className = '', ...props }) => {
  return (
    <span
      className={clsx(
        'badge',
        variants[variant] || variants.neutral,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
