import { useState } from "react";
import { useNavigate, Link } from "react-router";
import LoginPageInput from "../../Components/AuthPage/LoginPageInput";
import LoginPageSubmitButton from "../../Components/AuthPage/LoginPageSubmitButton";
import { useRegistrationMutation } from "../../Tanstack/Auth/AuthMutations";
import { useAuthContext } from "../../Providers/Auth/useAuthContext";

const Registration = () => {
    const { setToken } = useAuthContext();
    const [userData, setUserData] = useState<UserRegistrationCredentials>({
        name: "",
        login: "",
        password: "",
        password_confirmation: "",
    });
    const registerUser = useRegistrationMutation();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>();

    const handleRegistration = (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);

        registerUser.mutate(userData, {
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
        <div className="w-full h-screen flex justify-center items-center px-5">
            <form
                onSubmit={handleRegistration}
                className="min-w-50 w-3/5 max-w-120 flex flex-col bg-[#19191b] shadow-[0_0_6px_-2px_rgba(255,255,255,0.3)] rounded-lg py-6 px-8 gap-y-6 font-light"
            >
                <h1 className="text-center text-white/80 text-5xl font-bold">
                    Draggable To Do
                </h1>
                <p className="text-white/50 text-center">
                    Already have an account?&nbsp;
                    <Link
                        to={"/login"}
                        className="text-white font-normal hover:text-sky-400 transition-colors duration-300"
                    >
                        Log in here
                    </Link>
                </p>
                <LoginPageInput
                    type="text"
                    autoComplete="name"
                    placeholder="Enter your nickname"
                    value={userData.name}
                    onChange={(event) =>
                        setUserData((prev) => ({
                            ...prev,
                            name: event.target.value,
                        }))
                    }
                />
                <LoginPageInput
                    type="text"
                    autoComplete="email"
                    placeholder="Enter your login"
                    value={userData.login}
                    onChange={(event) =>
                        setUserData((prev) => ({
                            ...prev,
                            login: event.target.value,
                        }))
                    }
                />
                <LoginPageInput
                    type="password"
                    autoComplete="new-password"
                    placeholder="Enter your password"
                    value={userData.password}
                    onChange={(event) =>
                        setUserData((prev) => ({
                            ...prev,
                            password: event.target.value,
                        }))
                    }
                />
                <LoginPageInput
                    type="password"
                    autoComplete="new-password"
                    placeholder="Confirm your password"
                    value={userData.password_confirmation}
                    onChange={(event) =>
                        setUserData((prev) => ({
                            ...prev,
                            password_confirmation: event.target.value,
                        }))
                    }
                />
                <p
                    className={`w-full auto_size ${error ? "h-auto" : "h-0"} transition-all duration-300 overflow-hidden text-red-600 font-medium text-lg text-center`}
                >
                    {error || "\u00A0"}
                </p>
                <LoginPageSubmitButton
                    text="Sign up"
                    disabled={registerUser.isPending}
                />
            </form>
        </div>
    );
};

export default Registration;
