import api from "../../Libraries/axios";

class TaskService {
    public static async create(workspaceUuid: string, data: NewTask): Promise<Column> {
        return await api.post(`/workspaces/${workspaceUuid}/tasks`, { ...data, column_id: data.column?.id }).then((res) => res.data)
    }
}

export default TaskService