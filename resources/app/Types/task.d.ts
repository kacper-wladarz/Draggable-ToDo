interface NewTask {
    title: string
    column: Column | null
}

type NewTaskErrors = {
    [K in keyof NewTask]?: string[]
} & {
    column_id?: string[]
}

interface ChangePositionOfTaskInColumns {
    column_from: number
    column_to: number
    position_from: number
    position_to: number
}