import clsx from 'clsx';

const sizeMap = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-8 w-8 border-[3px]',
};

const Loader = ({ size = 'md', label, inline = false, className }) => {
  const spinner = (
    <span
      className={clsx(
        'inline-block animate-spin rounded-full border-primary border-t-transparent',
        sizeMap[size],
        className,
      )}
      aria-hidden="true"
    />
  );

  if (inline && label) {
    return (
      <span className="inline-flex items-center gap-2 text-sm text-muted">
        {spinner}
        {label}
      </span>
    );
  }

  if (label) {
    return (
      <div className="flex flex-col items-center gap-3 text-sm text-muted">
        {spinner}
        <span>{label}</span>
      </div>
    );
  }

  return spinner;
};

export default Loader;
