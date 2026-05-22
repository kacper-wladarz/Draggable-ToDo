import { useEffect, useState } from "react";
import { useAuthContext } from "../../Providers/Auth/AuthContext";
import { useLoginMutation } from "../../Queries/AuthQuery";
import { Link, useNavigate } from "react-router";
import LoginPageInput from "../../Components/LoginPage/LoginPageInput";
import LoginPageSubmitButton from "../../Components/LoginPage/LoginPageSubmitButton";

const Login = () => {
    const { isAuthenticated, setToken } = useAuthContext();
    const [userData, setUserData] = useState<UserLoginCredentials>({
        login: "",
        password: "",
    });
    const loginUser = useLoginMutation();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/", { replace: true });
        }
    }, [isAuthenticated, navigate]);

    if (isAuthenticated) {
        return null;
    }

    const handleLogin = (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);

        loginUser.mutate(userData, {
            onSuccess: (res) => {
                localStorage.setItem("user_auth", res.data.token);
                setToken(res.data.token);
                navigate("/");
            },
            onError: (error) => {
                setError(error.data.message);
            },
        });
    };

    return (
        <div className="w-full h-screen flex justify-center items-center">
            <form
                onSubmit={handleLogin}
                className="flex flex-col bg-[#19191b] shadow-[0_0_6px_-2px_rgba(255,255,255,0.3)] rounded-lg py-6 px-8 gap-y-6 font-light"
            >
                <h1 className="text-center text-white/80 text-5xl font-bold">
                    Draggable To Do
                </h1>
                <p className="text-white/50 text-center">
                    Don't have an account yet?&nbsp;
                    <Link
                        to={"/registration"}
                        className="text-white font-normal hover:text-sky-400 transition-colors duration-300"
                    >
                        Sign up here
                    </Link>
                </p>
                <LoginPageInput
                    type="text"
                    placeholder="Enter your login"
                    value={userData.login}
                    autoComplete="email"
                    onChange={(event) =>
                        setUserData((prev) => ({
                            ...prev,
                            login: event.target.value,
                        }))
                    }
                />
                <LoginPageInput
                    type="password"
                    placeholder="Enter your password"
                    value={userData.password}
                    autoComplete="current-password"
                    onChange={(event) =>
                        setUserData((prev) => ({
                            ...prev,
                            password: event.target.value,
                        }))
                    }
                />
                <span
                    className={`w-full auto_size ${error ? "h-auto" : "h-0"} transition-all duration-300 overflow-hidden text-red-600 font-medium text-lg text-center`}
                >
                    {error || "\u00A0"}
                </span>
                <LoginPageSubmitButton
                    text="Login"
                    disabled={loginUser.isPending}
                />
            </form>
        </div>
    );
};

export default Login;
