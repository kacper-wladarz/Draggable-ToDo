import { useQuery } from "@tanstack/react-query";
import api from "../../Libraries/axios";

export const useAuthQuery = (enabled: boolean = true) => {
    return useQuery({
        queryKey: ["user_auth"],
        queryFn: async () => await api.get("/auth/me").then((res) => res.data.user),
        enabled,
        staleTime: 0,
    })
}