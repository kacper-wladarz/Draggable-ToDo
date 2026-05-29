import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import { useAuthQuery } from "../../Tanstack/Auth/AuthQueries";
import { useQueryClient } from "@tanstack/react-query";

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
    const queryClient = useQueryClient();
    const [token, setToken] = useState<string | null>(
        localStorage.getItem("user_auth") || null,
    );
    const { data: user = null, isLoading } = useAuthQuery(!!token);

    const setTokenState = (newToken: string | null) => {
        if (newToken) {
            localStorage.setItem("user_auth", newToken);
        } else {
            localStorage.removeItem("user_auth");
            queryClient.clear();
        }

        setToken(newToken);
    };

    useEffect(() => {
        const handler = () => setTokenState(null);
        window.addEventListener("unauthorized", handler);

        return () => window.removeEventListener("unauthorized", handler);
    }, []);

    return (
        <AuthContext.Provider
            value={{
                token,
                setToken: setTokenState,
                isLoading: !!token && isLoading,
                user: user
                    ? {
                          id: user.id,
                          name: user.name,
                          login: user.login,
                          created_at: user.created_at,
                          updated_at: user.updated_at,
                      }
                    : null,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuthContext must be used within an AuthContextProvider",
        );
    }

    return context;
};
