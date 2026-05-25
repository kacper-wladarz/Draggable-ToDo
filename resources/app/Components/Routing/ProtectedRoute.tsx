import { Navigate, Outlet } from "react-router";
import { useAuthContext } from "../../Providers/Auth/AuthContext";

const ProtectedRoute = () => {
    const { isAuthenticated } = useAuthContext();

    return isAuthenticated ? <Outlet /> : <Navigate to={"/login"} replace />;
};

export default ProtectedRoute;
