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
    column_id_from: number
    column_id_to: number
    old_position_in_column: number
    new_position_in_column: number
}