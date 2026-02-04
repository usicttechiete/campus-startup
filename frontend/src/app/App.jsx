import { Navigate, Route, Routes } from 'react-router-dom';
import { Suspense, lazy, useMemo } from 'react';
import Navbar from '../components/Navbar/Navbar.jsx';
import Loader from '../components/Loader/Loader.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useRole } from '../context/RoleContext.jsx';
import routes from './routes.jsx';

const LoginScreen = lazy(() => import('../pages/Login/Login.jsx'));

const PageFallback = () => (
  <div className="flex h-full items-center justify-center">
    <Loader size="lg" label="Loading page" />
  </div>
);

const AppLayout = ({ children }) => (
  <div className="mx-auto flex min-h-screen max-w-screen-md flex-col gap-4 bg-surface px-4 pb-24 pt-6 sm:px-8">
    <div className="flex-1">{children}</div>
    <Navbar />
  </div>
);

const ProtectedRoute = ({ element, allowedRoles }) => {
  const { authLoading, user } = useAuth();
  const { role, roleLoading } = useRole();

  if (authLoading || roleLoading) {
    return <PageFallback />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    const fallback = routes.find((route) => route.path === '/');
    return <Navigate to={fallback?.path || '/'} replace />;
  }

  return element;
};

const App = () => {
  const { authLoading, user } = useAuth();
  const { roleLoading } = useRole();

  const availableRoutes = useMemo(() => routes, []);

  if (authLoading || roleLoading) {
    return <PageFallback />;
  }

  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginScreen />} />
        {availableRoutes.map(({ path, element: Element, allowedRoles }) => (
          <Route
            key={path}
            path={path}
            element={
              <AppLayout>
                <ProtectedRoute element={<Element />} allowedRoles={allowedRoles} />
              </AppLayout>
            }
          />
        ))}
        <Route path="*" element={<Navigate to={user ? '/' : '/login'} replace />} />
      </Routes>
    </Suspense>
  );
};

export default App;
