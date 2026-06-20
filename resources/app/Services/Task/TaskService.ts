import api from "../../Libraries/axios";

class TaskService {
    public static async create(workspaceUuid: string, data: NewTask): Promise<Column> {
        return await api.post(`/workspaces/${workspaceUuid}/tasks`, { ...data, column_id: data.column?.id }).then((res) => res.data)
    }

    public static async update(workspaceUuid: string, taskUuid: string, data: ManageTaskData): Promise<Task> {
        return await api.patch(`/workspaces/${workspaceUuid}/tasks/${taskUuid}`, data).then((res) => res.data)
    }

    public static async delete(workspaceUuid: string, taskUuid: string): Promise<any> {
        return await api.delete(`/workspaces/${workspaceUuid}/tasks/${taskUuid}`).then((res) => res.data)
    }
}

export default TaskService