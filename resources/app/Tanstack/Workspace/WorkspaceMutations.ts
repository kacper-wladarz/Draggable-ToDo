import { useMutation } from "@tanstack/react-query"
import WorkspaceService from "../../Services/Workspace/WorkspaceService"

export const useCreateWorkspace = () => {
    return useMutation({ mutationKey: ["new-workspace"], mutationFn: async (data: NewWorkspace) => await WorkspaceService.createWorkspace(data) })
}

export const useChangeWorkspacePosition = () => {
    return useMutation({
        mutationKey: ["change-position"],
        mutationFn: async (data: ChangeWorkspacePosition) => await WorkspaceService.changeWorkspacePosition(data)
    })
}