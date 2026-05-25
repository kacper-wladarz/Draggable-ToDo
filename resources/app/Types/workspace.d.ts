interface NewWorkspace {
    name: string
}

type NewWorkspaceErrors = {
    [K in keyof NewWorkspace]?: string[]
}