interface AuthContextType {
    token: string | null;
    setToken: React.Dispatch<React.SetStateAction<string | null>>;
    isAuthenticated: boolean;
    user: UserData | null;
}