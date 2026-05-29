interface AuthContextType {
    token: string | null;
    setToken: (newToken: string | null) => void
    isLoading: boolean
    user: UserData | null;
}