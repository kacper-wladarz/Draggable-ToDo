import { useMutation } from "@tanstack/react-query"
import api from "../../Libraries/axios"

export const useCreateProject = () => {
    return useMutation({ mutationKey: ["new-project"], mutationFn: async (data: NewProject) => api.post("/projects", data) })
}