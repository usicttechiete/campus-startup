import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { useMemo } from 'react';
import { useRole } from '../../context/RoleContext.jsx';

// Modern SVG icons
const HomeIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const BriefcaseIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const RocketIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>
);

const CalendarIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const ChatIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const UserIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const GraduationIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);

const iconMap = {
  home: HomeIcon,
  briefcase: BriefcaseIcon,
  rocket: RocketIcon,
  calendar: CalendarIcon,
  chat: ChatIcon,
  user: UserIcon,
  graduation: GraduationIcon,
};

// Navigation items - Admins have Hire tab to view all jobs, students post from startup pages
const navItems = [
  { to: '/', label: 'Home', icon: 'home', roles: ['student', 'admin'] },
  { to: '/internships', label: 'Jobs', icon: 'graduation', roles: ['student'] },
  { to: '/hire', label: 'Hire', icon: 'briefcase', roles: ['admin'] },
  { to: '/admin/startups', label: 'Startups', icon: 'rocket', roles: ['admin'] },
  { to: '/events', label: 'Events', icon: 'calendar', roles: ['student', 'admin'] },
  { to: '/profile', label: 'Me', icon: 'user', roles: ['student', 'admin'] },
];

const Navbar = () => {
  const { role } = useRole();

  const itemsToRender = useMemo(() =>
    navItems.filter((item) => item.roles.includes(role)),
    [role]
  );

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-white/10 shadow-lg"
      style={{ width: '100%', maxWidth: '480px' }}
    >
      <div className="flex items-center justify-around px-1 py-2">
        {itemsToRender.map((item) => {
          const IconComponent = iconMap[item.icon] || HomeIcon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                clsx(
                  'relative flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-all',
                  isActive
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white'
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute inset-0 rounded-xl bg-blue-50 dark:bg-blue-900/20" />
                  )}
                  <IconComponent className={clsx('relative z-10 h-5 w-5', isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400')} />
                  <span className="relative z-10 text-[10px]">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;
