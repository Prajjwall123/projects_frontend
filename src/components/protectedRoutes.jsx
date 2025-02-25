import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../core/context/authContext";

const ProtectedRoute = ({ requiredRole }) => {
    const { user, isLoggedIn } = useAuth();

    if (!isLoggedIn()) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && user?.role !== requiredRole) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
