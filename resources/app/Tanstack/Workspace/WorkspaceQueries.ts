import { useSuspenseQuery } from "@tanstack/react-query";
import WorkspaceService from "../../Services/Workspace/WorkspaceService";

export const useWorkspaces = (isLoggedIn: boolean) => {
    return useSuspenseQuery({
        queryKey: ["workspaces", isLoggedIn],
        queryFn: async () => {
            if (!isLoggedIn) return [];

            return await WorkspaceService.getWorkspaces();
        },
        staleTime: 1000 * 60 * 5
    });
};

export const useWorkspace = (uuid: string) => {
    return useSuspenseQuery({
        queryKey: ["workspaces", uuid],
        queryFn: async () => await WorkspaceService.getSingleWorkspace(uuid),
        staleTime: 1000 * 60 * 5,
    })
}

export const useWorksaceVisibleColumns = (uuid: string) => {
    return useSuspenseQuery({
        queryKey: ["workspaces", uuid, "visible-columns"],
        queryFn: async () => await WorkspaceService.getVisibleColumns(uuid),
        staleTime: 1000 * 60 * 5
    })
}