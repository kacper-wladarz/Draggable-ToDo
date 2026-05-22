import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../Libraries/axios";

export const useAuthQuery = (enabled: boolean = true) => {
    return useQuery({
        queryKey: ["user_auth"],
        queryFn: async () => await api.get("/auth/me").then((res) => res.data.user),
        enabled,
        staleTime: 0,
        refetchOnWindowFocus: false
    })
}

export const useLoginMutation = () => {
    return useMutation({
        mutationKey: ["login"],
        mutationFn: async (data: UserLoginCredentials) => await api.post("/auth/login", data)
    })
}

export const useRegistrationMutation = () => {
    return useMutation({
        mutationKey: ["registration"],
        mutationFn: async (data: UserRegistrationCredentials) => await api.post("/auth/registration", data)
    })
}

export const useLogoutMutation = () => {
    return useMutation({
        mutationKey: ["logout"],
        mutationFn: async () => await api.post("/auth/logout")
    })
}