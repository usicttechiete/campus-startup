import { lazy } from 'react';

const HomePage = lazy(() => import('../pages/Home/Home.jsx'));
const InternshipsPage = lazy(() => import('../pages/Internships/Internships.jsx'));
const HirePage = lazy(() => import('../pages/Hire/Hire.jsx'));
const EventsListPage = lazy(() => import('../pages/Events/EventsList.jsx'));
const EventDetailPage = lazy(() => import('../pages/Events/EventDetail.jsx'));
const EventAdminDashboardPage = lazy(() => import('../pages/Events/EventAdminDashboard.jsx'));
const AdminStartupsDashboardPage = lazy(() => import('../pages/AdminStartups/AdminStartupsDashboard.jsx'));
const ProfilePage = lazy(() => import('../pages/Profile/Profile.jsx'));
const LetsBuildPage = lazy(() => import('../pages/LetsBuild/LetsBuild.jsx'));
const ChatPage = lazy(() => import('../pages/ChatPage.jsx'));

const routes = [
  {
    path: '/chat',
    element: ChatPage,
    allowedRoles: ['student', 'admin', 'organizer', 'club'],
  },
  {
    path: '/',
    element: HomePage,
    allowedRoles: ['student', 'admin', 'organizer', 'club'],
  },
  {
    path: '/internships',
    element: InternshipsPage,
    allowedRoles: ['student'],
  },
  {
    path: '/hire',
    element: HirePage,
    allowedRoles: ['admin', 'student'],
  },
  {
    path: '/events',
    element: EventsListPage,
    allowedRoles: ['student', 'admin', 'organizer', 'club'],
  },
  {
    path: '/events/:eventId',
    element: EventDetailPage,
    allowedRoles: ['student', 'admin', 'organizer', 'club'],
  },
  {
    path: '/events/:eventId/manage',
    element: EventAdminDashboardPage,
    allowedRoles: ['admin', 'organizer', 'club'],
  },
  {
    path: '/admin/startups',
    element: AdminStartupsDashboardPage,
    allowedRoles: ['admin'],
  },
  {
    path: '/profile',
    element: ProfilePage,
    allowedRoles: ['student', 'admin'],
  },
  {
    path: '/lets-build',
    element: LetsBuildPage,
    allowedRoles: ['student', 'admin', 'organizer', 'club'],
  },
];

export default routes;
