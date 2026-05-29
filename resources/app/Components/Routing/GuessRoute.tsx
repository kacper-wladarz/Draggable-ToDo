import { Navigate, Outlet } from "react-router";
import { useAuthContext } from "../../Providers/Auth/AuthContext";
import { useLoadingContext } from "../../Providers/Loading/LoadingContext";

const GuessRoute = () => {
    const { user } = useAuthContext();
    const { isAppLoading } = useLoadingContext();

    if (isAppLoading) return null;

    return !!user ? <Navigate to={"/"} replace /> : <Outlet />;
};

export default GuessRoute;
