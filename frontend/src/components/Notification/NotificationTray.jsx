const variantStyles = {
  success: 'bg-success/10 text-success border-success/20',
  error: 'bg-danger/10 text-danger border-danger/20',
  info: 'bg-primary-light text-primary border-primary/20',
};

const NotificationTray = ({ notifications = [], onDismiss }) => {
  return (
    <div className="fixed right-4 top-6 z-50 space-y-3">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`flex w-72 items-start justify-between gap-3 rounded-2xl border bg-card px-4 py-3 text-sm shadow-card ${
            variantStyles[notification.variant] || variantStyles.info
          }`}
          role="status"
        >
          <p className="text-sm font-medium text-body">{notification.message}</p>
          <button
            type="button"
            onClick={() => onDismiss?.(notification.id)}
            className="text-xs font-semibold text-muted transition hover:text-body"
            aria-label="Dismiss notification"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationTray;
