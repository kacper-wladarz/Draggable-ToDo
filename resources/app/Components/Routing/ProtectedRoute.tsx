import { Navigate, Outlet } from "react-router";
import { useAuthContext } from "../../Providers/Auth/AuthContext";
import FadeIn from "../Animations/FadeIn";

const ProtectedRoute = () => {
    const { user, token } = useAuthContext();

    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <FadeIn>
            <Outlet />
        </FadeIn>
    );
};

export default ProtectedRoute;
