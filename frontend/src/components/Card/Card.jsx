import clsx from 'clsx';

import { forwardRef } from 'react';

const Card = forwardRef(({ children, className = '', onClick, ...props }, ref) => {
  return (
    <div
      ref={ref}
      onClick={onClick}
      className={clsx(
        'glass-card',
        onClick && 'cursor-pointer',
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
