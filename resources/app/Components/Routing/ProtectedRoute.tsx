import { Navigate, Outlet } from "react-router";
import Animations from "../Animations";
import { useAuthContext } from "../../Providers/Auth/useAuthContext";

const ProtectedRoute = () => {
    const { user, token } = useAuthContext();

    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <Animations.FadeIn>
            <Outlet />
        </Animations.FadeIn>
    );
};

export default ProtectedRoute;
