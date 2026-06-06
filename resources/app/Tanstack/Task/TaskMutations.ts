import { useMutation } from "@tanstack/react-query"
import TaskService from "../../Services/Task/TaskService"

export const useCreateTask = (workspaceUuid: string) => {
    return useMutation({
        mutationKey: ["new-task"],
        mutationFn: async (data: NewTask) => await TaskService.create(workspaceUuid, data)
    })
}