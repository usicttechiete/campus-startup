import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { useEffect, useMemo, useState } from 'react';
import { useRole } from '../../context/RoleContext.jsx';
import { getMyStartup } from '../../services/startup.api.js';

const navItems = [
  { to: '/', label: 'Home', icon: '🏠', roles: ['student', 'admin'] },
  { to: '/internships', label: 'Internships', icon: '🎓', roles: ['student'], hideWhenStartupApproved: true },
  { to: '/hire', label: 'Hire', icon: '🧑‍💼', roles: ['admin', 'student'], requiresStartupApproval: true },
  { to: '/admin/startups', label: 'Startups', icon: '🚀', roles: ['admin'] },
  { to: '/events', label: 'Events', icon: '🎉', roles: ['student', 'admin'] },
  { to: '/chat', label: 'Chat', icon: '🤖', roles: ['student', 'admin'] },
  { to: '/profile', label: 'Profile', icon: '👤', roles: ['student', 'admin'] },
];

const STARTUP_STATUS_KEY = 'startupStatus';

const Navbar = () => {
  const { role } = useRole();
  const [startupStatus, setStartupStatus] = useState(() => {
    if (role !== 'student') return null;
    const cached = localStorage.getItem(STARTUP_STATUS_KEY);
    return cached || null;
  });

  useEffect(() => {
    let isMounted = true;

    const loadStartupStatus = async () => {
      if (role !== 'student') {
        if (isMounted) setStartupStatus(null);
        localStorage.removeItem(STARTUP_STATUS_KEY);
        return;
      }

      try {
        const data = await getMyStartup();
        if (!isMounted) return;
        const nextStatus = data?.status || 'NONE';
        setStartupStatus(nextStatus);
        localStorage.setItem(STARTUP_STATUS_KEY, nextStatus);
      } catch (error) {
        if (!isMounted) return;
        setStartupStatus('NONE');
        localStorage.setItem(STARTUP_STATUS_KEY, 'NONE');
      }
    };

    loadStartupStatus();

    return () => {
      isMounted = false;
    };
  }, [role]);

  const itemsToRender = useMemo(() =>
    navItems.filter((item) => {
      if (item.roles && !item.roles.includes(role)) return false;
      if (role === 'student' && item.requiresStartupApproval && startupStatus !== 'APPROVED') return false;
      if (role === 'student' && item.hideWhenStartupApproved && startupStatus === 'APPROVED') return false;
      return true;
    }),
  [role, startupStatus]);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur">
      <div className="mx-auto flex max-w-screen-md items-center justify-between px-6 py-3">
        {itemsToRender.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                clsx(
                  'flex flex-col items-center gap-1 text-xs font-medium transition',
                  isActive ? 'text-primary' : 'text-muted hover:text-body',
                )
              }
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
      </div>
    </nav>
  );
};

export default Navbar;
