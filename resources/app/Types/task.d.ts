interface NewTask {
    title: string
    column: Column | null
}

type NewTaskErrors = {
    [K in keyof NewTask]?: string[]
} & {
    column_id?: string[]
}