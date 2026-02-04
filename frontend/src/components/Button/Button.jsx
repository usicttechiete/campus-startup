import clsx from 'clsx';

const baseStyles =
  'inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2';

const variants = {
  primary: 'bg-primary text-white shadow-soft hover:bg-primary-dark focus-visible:outline-primary',
  ghost: 'bg-transparent text-primary hover:bg-primary-light focus-visible:outline-primary',
  subtle: 'bg-card text-body border border-border hover:border-primary focus-visible:outline-primary',
  badge: 'rounded-full bg-primary-light px-3 py-1 text-xs font-medium text-primary',
  danger: 'bg-danger text-white hover:bg-danger/90 focus-visible:outline-danger',
};

const sizes = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-5 py-3 text-sm',
  lg: 'px-6 py-3.5 text-base',
};

const Button = ({
  as: Component = 'button',
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) => {
  return (
    <Component className={clsx(baseStyles, variants[variant], sizes[size], className)} {...props}>
      {children}
    </Component>
  );
};

export default Button;
