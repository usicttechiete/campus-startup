import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import NotificationTray from '../components/Notification/NotificationTray.jsx';

const NotificationContext = createContext();

const DEFAULT_DURATION = 4000;

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const dismiss = useCallback((id) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const notify = useCallback(
    ({ message, variant = 'success', duration = DEFAULT_DURATION }) => {
      const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      setNotifications((prev) => [...prev, { id, message, variant }]);

      if (duration !== null && duration !== undefined) {
        setTimeout(() => {
          dismiss(id);
        }, duration);
      }

      return id;
    },
    [dismiss],
  );

  const value = useMemo(
    () => ({
      notify,
      dismiss,
    }),
    [dismiss, notify],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationTray notifications={notifications} onDismiss={dismiss} />
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
