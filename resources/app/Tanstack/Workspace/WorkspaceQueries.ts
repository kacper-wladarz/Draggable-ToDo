import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import WorkspaceService from "../../Services/Workspace/WorkspaceService";

export const useWorkspaces = (isLoggedIn: boolean) => {
    return useSuspenseQuery({
        queryKey: ["workspaces"],
        queryFn: async () => {
            if (!isLoggedIn) return [];

            return await WorkspaceService.getWorkspaces();
        },
        staleTime: 1000 * 60 * 5
    });
};

export const useWorkspace = (uuid: string) => {
    return useQuery({
        queryKey: ["workspaces", uuid],
        queryFn: async () => await WorkspaceService.getSingleWorkspace(uuid),
    })
}