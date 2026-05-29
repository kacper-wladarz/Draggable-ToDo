interface AuthContextType {
    token: string | null;
    setToken: (newToken: string | null) => void
    user: UserData | null;
}