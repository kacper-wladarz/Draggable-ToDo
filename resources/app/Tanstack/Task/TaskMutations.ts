import { useMutation } from "@tanstack/react-query"
import TaskService from "../../Services/Task/TaskService"

export const useCreateTask = (workspaceUuid: string) => {
    return useMutation({
        mutationKey: ["new-task"],
        mutationFn: async (data: NewTask) => await TaskService.create(workspaceUuid, data)
    })
}

export const useUpdateTask = () => {
    return useMutation({
        mutationKey: ["update-task"],
        mutationFn: async ({ workspaceUuid, taskUuid, data }: {
            workspaceUuid: string,
            taskUuid: string,
            data: ManageTaskData
        }) => await TaskService.update(workspaceUuid, taskUuid, data)
    })
}

export const useDeleteTask = () => {
    return useMutation({
        mutationKey: ["delete-task"],
        mutationFn: async ({
            workspaceUuid,
            taskUuid
        }: {
            workspaceUuid: string,
            taskUuid: string
        }) => await TaskService.delete(workspaceUuid, taskUuid)
    })
}