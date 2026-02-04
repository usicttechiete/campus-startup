import clsx from 'clsx';

const Card = ({ children, className = '', onClick, ...props }) => {
  return (
    <div
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
};

export default Card;
