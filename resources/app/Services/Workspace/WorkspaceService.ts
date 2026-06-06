import api from "../../Libraries/axios"

class WorkspaceService {
    public static async getWorkspaces(): Promise<Workspace[]> {
        return await api.get("/workspaces").then((res) => res.data)
    }

    public static async createWorkspace(data: NewWorkspace): Promise<Workspace> {
        return await api.post("/workspaces", data).then((res) => res.data)
    }

    public static async getSingleWorkspace(uuid: string): Promise<WorkspaceWithColumnsAndTasks> {
        return await api.get(`/workspaces/${uuid}`).then((res) => res.data)
    }

    public static async changeWorkspacePosition(data: ChangeWorkspacePosition) {
        return await api.patch(`/workspaces/${data.uuid}/position`, { position_from: data.position_from, position_to: data.position_to });
    }

    public static async getVisibleColumns(uuid: string): Promise<Column[]> {
        return await api.get(`/workspaces/${uuid}/visible-columns`).then((res) => res.data);
    }
}

export default WorkspaceService