import { useSuspenseQuery } from "@tanstack/react-query";
import api from "../../Libraries/axios";

export const useAuthQuery = (token: string | null) => {
    return useSuspenseQuery({
        queryKey: ["user_auth", token ?? null],
        queryFn: async () => {
            if (!token) return null;

            const res = await api.get("/auth/me");
            return res.data.user;
        },
        staleTime: Infinity,
    });
};