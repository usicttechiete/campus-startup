import clsx from 'clsx';
import { forwardRef } from 'react';

const Card = forwardRef(({
  children,
  className = '',
  onClick,
  hover = true,
  padding = 'default',
  ...props
}, ref) => {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    default: 'p-4',
    lg: 'p-6',
  };

  return (
    <div
      ref={ref}
      onClick={onClick}
      className={clsx(
        // Base styles - LinkedIn-inspired professional card
        'bg-bg-elevated rounded-xl border border-border shadow-card',
        'transition-all duration-200',
        // Hover effect
        hover && 'hover:shadow-md hover:border-border-hover',
        // Interactive cursor
        onClick && 'cursor-pointer',
        // Padding
        paddingClasses[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export default Card;
