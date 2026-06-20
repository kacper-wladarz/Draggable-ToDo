import { Navigate, Outlet, useLocation } from "react-router";
import Animations from "../Animations";
import { useAuthContext } from "../../Providers/Auth/useAuthContext";

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
