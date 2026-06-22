import { useMutation, useQueryClient } from "@tanstack/react-query"
import WorkspaceService from "../../Services/Workspace/WorkspaceService"

export const useCreateWorkspace = () => {
    return useMutation({ mutationKey: ["new-workspace"], mutationFn: async (data: NewWorkspace) => await WorkspaceService.createWorkspace(data) })
}

export const useChangeWorkspacePosition = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ["change-position"],
        mutationFn: async (data: ChangeWorkspacePosition) => await WorkspaceService.changeWorkspacePosition(data),
        onMutate: async (vars) => {
            await queryClient.cancelQueries({
                queryKey: ["workspaces"]
            })

            const previousWorkspaces = queryClient.getQueryData<Workspace[]>(["workspaces"])

            queryClient.setQueryData(
                ["workspaces"],
                (prev: Workspace[] = []) => {
                    const items = [...prev];

                    const sourceIndex = items.findIndex((workspace) => workspace.uuid === vars.uuid)

                    if (sourceIndex === -1) {
                        return prev
                    }

                    const targetIndex = items.length - vars.position_to - 1

                    const [removed] = items.splice(sourceIndex, 1);

                    items.splice(targetIndex, 0, removed);

                    return items;
                },
            );

            return { previousWorkspaces }
        },
        onError: (_, __, context) => {
            queryClient.setQueryData(["workspaces"], context?.previousWorkspaces)
        }
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

export const useToggleColumnVisibility = () => {
    return useMutation({
        mutationKey: ["toggle-workspace-visibility"],
        mutationFn: async (data: ToggleColumnVisibility) => await WorkspaceService.toggleColumnVisibility(data)
    })
}