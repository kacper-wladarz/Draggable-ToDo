interface NewWorkspace {
    name: string
}

type NewWorkspaceErrors = {
    [K in keyof NewWorkspace]?: string[]
}

interface Workspace {
    uuid: string
    name: string
    user_id: number
    position: number
    created_at: string
    updated_at: string
}

interface WorkspaceContext {
    openedWorkspaceUuid: string | null
    setOpenedWorkspaceUuid: React.Dispatch<React.SetStateAction<string | null>>
    workspacesList: Workspace[]
    setWorkspacesList: React.Dispatch<React.SetStateAction<Workspace[]>>
    addWorkspaceToList: (workspace: Workspace) => void
}

interface ChangeWorkspacePosition {
    uuid: string
    position_from: number
    position_to: number
}