import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { useAuthQuery } from "../../Tanstack/Auth/AuthQueries";
import LoaderIcon from "../../Assets/LoaderIcon";

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(
        localStorage.getItem("user_auth") || "",
    );
    const isAuthenticated = useMemo(() => !!token, [token]);
    const { data: user, isLoading } = useAuthQuery(!!token);

    if (isLoading || (isAuthenticated && !user)) {
        return <LoaderIcon />;
    }

    return (
        <AuthContext.Provider
            value={{
                token,
                setToken,
                isAuthenticated,
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
