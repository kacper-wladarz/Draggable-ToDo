import { useMutation } from "@tanstack/react-query"
import api from "../../Libraries/axios"

export const useCreateWorkspace = () => {
    return useMutation({ mutationKey: ["new-workspace"], mutationFn: async (data: NewWorkspace) => api.post("/workspaces", data) })
}