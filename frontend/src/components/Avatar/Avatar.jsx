import clsx from 'clsx';

const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-xl',
    '2xl': 'w-24 h-24 text-2xl',
};

const Avatar = ({
    src,
    alt = '',
    size = 'md',
    fallback,
    className = '',
    ...props
}) => {
    const initials = fallback || alt?.slice(0, 2).toUpperCase() || '?';

    return (
        <div
            className={clsx(
                'relative inline-flex items-center justify-center rounded-full',
                'bg-primary-100 text-primary font-semibold flex-shrink-0',
                'ring-2 ring-white shadow-sm',
                sizes[size],
                className
            )}
            {...props}
        >
            {src ? (
                <img
                    src={src}
                    alt={alt}
                    className="w-full h-full rounded-full object-cover"
                    onError={(e) => {
                        e.target.style.display = 'none';
                    }}
                />
            ) : (
                <span>{initials}</span>
            )}
        </div>
    );
};

export default Avatar;
