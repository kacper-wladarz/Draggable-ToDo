import { useQuery } from "@tanstack/react-query"
import WorkspaceService from "../../Services/Workspace/WorkspaceService"

export const useWorkspaces = (enabled: boolean = false) => {
    return useQuery({
        queryKey: ["workspaces"],
        queryFn: async () => await WorkspaceService.getWorkspaces(),
        enabled
    })
}

export const useWorkspace = (uuid: string) => {
    return useQuery({
        queryKey: ["workspaces", uuid],
        queryFn: async () => await WorkspaceService.getSingleWorkspace(uuid),
    })
}