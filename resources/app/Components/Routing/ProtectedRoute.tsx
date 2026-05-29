import { Navigate, Outlet } from "react-router";
import { useAuthContext } from "../../Providers/Auth/AuthContext";
import { useLoadingContext } from "../../Providers/Loading/LoadingContext";

const ProtectedRoute = () => {
    const { user } = useAuthContext();
    const { isAppLoading } = useLoadingContext();

    if (isAppLoading) return null;

    return user ? <Outlet /> : <Navigate to={"/login"} replace />;
};

export default ProtectedRoute;
