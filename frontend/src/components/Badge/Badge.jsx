import clsx from 'clsx';

const variants = {
  success: 'bg-success-100 text-success border-success/20',
  warning: 'bg-warning-100 text-warning border-warning/20',
  danger: 'bg-danger-100 text-danger border-danger/20',
  info: 'bg-info-100 text-info border-info/20',
  neutral: 'bg-bg-subtle text-text-secondary border-border',
  primary: 'bg-primary-100 text-primary border-primary/20',
  secondary: 'bg-secondary/10 text-secondary border-secondary/20',
  accent: 'bg-accent/10 text-accent border-accent/20',
  // Legacy support
  trust: 'bg-accent/10 text-accent border-accent/20',
  level: 'bg-secondary/10 text-secondary border-secondary/20',
};

const Badge = ({
  children,
  variant = 'neutral',
  className = '',
  ...props
}) => {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 px-3 py-1',
        'text-xs font-medium rounded-full border',
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
