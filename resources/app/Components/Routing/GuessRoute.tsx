import { Navigate, Outlet, useLocation } from "react-router";
import { useAuthContext } from "../../Providers/Auth/AuthContext";
import Animations from "../Animations";

const GuessRoute = () => {
    const { user, token } = useAuthContext();
    const { pathname } = useLocation();

    if (token && user) {
        return <Navigate to="/" replace />;
    }

    return (
        <Animations.FadeIn key={pathname}>
            <Outlet />
        </Animations.FadeIn>
    );
};

export default GuessRoute;
