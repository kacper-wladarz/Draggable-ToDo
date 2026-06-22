import { useSuspenseQuery } from "@tanstack/react-query";
import WorkspaceService from "../../Services/Workspace/WorkspaceService";

export const useWorkspaces = (token?: string | null) => {
    return useSuspenseQuery({
        queryKey: ["workspaces"],
        queryFn: async () => {
            if (!token) return []
            return await WorkspaceService.getWorkspaces()
        },
        staleTime: Infinity,
        select: (data: Workspace[]) => [...data].sort((a, b) => b.position - a.position)
    });
};

export const useWorkspace = (uuid: string) => {
    return useSuspenseQuery({
        queryKey: ["workspaces", uuid],
        queryFn: async () => {
            const data = await WorkspaceService.getSingleWorkspace(uuid);
            return {
                ...data,
                columns: data.columns.map((column: ColumnForWorkspace) => ({
                    ...column,
                    tasks: [...column.tasks].sort((a, b) => b.position - a.position),
                })),
            }
        }
        ,
        staleTime: 1000 * 60 * 5,
    })
}

export const useWorkspaceVisibleColumns = (uuid: string) => {
    return useSuspenseQuery({
        queryKey: ["workspaces", uuid, "visible-columns"],
        queryFn: async () => await WorkspaceService.getVisibleColumns(uuid),
        staleTime: 1000 * 60 * 5
    })
}