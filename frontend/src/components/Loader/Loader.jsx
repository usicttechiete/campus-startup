import clsx from 'clsx';

const sizeStyles = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-8 h-8 border-3',
};

const Loader = ({ size = 'md', label, inline = false, className }) => {
  return (
    <div
      className={clsx(
        'flex items-center gap-2',
        inline ? 'inline-flex' : 'flex-col justify-center',
        className
      )}
    >
      <div
        className={clsx(
          'animate-spin rounded-full border-primary border-t-transparent',
          sizeStyles[size]
        )}
      />
      {label && (
        <span className={clsx(
          'text-text-muted',
          size === 'sm' ? 'text-xs' : 'text-sm'
        )}>
          {label}
        </span>
      )}
    </div>
  );
};

export default Loader;
