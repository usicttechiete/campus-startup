import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useRole } from '../../context/RoleContext.jsx';
import Loader from '../Loader/Loader.jsx';

const ProtectedRoute = ({ children, requiredRole }) => {
    const { user, authLoading } = useAuth();
    const { role } = useRole();

    // Show loading while checking auth
    if (authLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-bg">
                <Loader label="Loading..." />
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Check role if required
    if (requiredRole && role !== requiredRole) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
