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

export const useUpdateWorkspace = (uuid: string) => {
    return useMutation({
        mutationKey: ["update-workspace"],
        mutationFn: async (data: NewWorkspace) => await WorkspaceService.updateWorkspace(uuid, data)
    })
}

export const useDeleteWorkspace = () => {
    return useMutation({
        mutationKey: ["delete-workspace"],
        mutationFn: async (uuid: string) => await WorkspaceService.delete(uuid)
    })
}