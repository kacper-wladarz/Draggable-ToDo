import { Navigate, Outlet } from "react-router";
import { useAuthContext } from "../../Providers/Auth/AuthContext";
import Animations from "../Animations";

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
