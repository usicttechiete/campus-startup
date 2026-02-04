import clsx from 'clsx';

const variantStyles = {
  primary: 'bg-primary-light text-primary',
  neutral: 'bg-surface text-muted border border-border',
  success: 'bg-success/10 text-success',
  level: 'bg-[#F0E7FF] text-[#5B21B6]',
  trust: 'bg-[#DFF5FF] text-[#0F5B78]',
};

const Badge = ({ children, variant = 'primary', className }) => {
  return (
    <span className={clsx('inline-flex items-center rounded-full px-3 py-1 text-xs font-medium', variantStyles[variant], className)}>
      {children}
    </span>
  );
};

export default Badge;
