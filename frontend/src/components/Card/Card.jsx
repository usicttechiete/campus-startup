import clsx from 'clsx';

const Card = ({ children, className }) => {
  return <div className={clsx('rounded-3xl bg-card p-5 shadow-card', className)}>{children}</div>;
};

export default Card;
