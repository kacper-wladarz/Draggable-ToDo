import { Navigate, Outlet } from "react-router";
import { useAuthContext } from "../../Providers/Auth/AuthContext";

const GuessRoute = () => {
    const { isAuthenticated } = useAuthContext();

    return isAuthenticated ? <Navigate to={"/"} replace /> : <Outlet />;
};

export default GuessRoute;
