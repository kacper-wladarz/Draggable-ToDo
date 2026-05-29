import { Navigate, Outlet } from "react-router";
import { useAuthContext } from "../../Providers/Auth/AuthContext";
import FadeIn from "../Animations/FadeIn";

const GuessRoute = () => {
    const { user, token } = useAuthContext();

    if (token && user) {
        return <Navigate to="/" replace />;
    }

    return (
        <FadeIn>
            <Outlet />
        </FadeIn>
    );
};

export default GuessRoute;
