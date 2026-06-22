import { Link, useParams } from "react-router";
import { useWorkspace } from "../../../Tanstack/Workspace/WorkspaceQueries";
import { DragDropProvider } from "@dnd-kit/react";
import Animations from "../../../Components/Animations";
import Form from "../../../Components/WorkspacePanel/ResourceForm";
import { LayersPlus, PenLine } from "lucide-react";
import { ButtonAppearance } from "../../../Components/WorkspacePanel/ResourceForm/FormButton";
import ToggleColumnDropdown from "../../../Components/WorkspacePanel/ToggleColumnDropdown";
import { move } from "@dnd-kit/helpers";
import { useQueryClient } from "@tanstack/react-query";
import WorkspaceColumn from "../../../Components/WorkspacePanel/WorkspaceColumn";
import { useRef } from "react";
import { useChangeTaskPosition } from "../../../Tanstack/Task/TaskMutations";

const SingleWorkspace = () => {
    const queryClient = useQueryClient();
    const { workspaceUuid } = useParams() as { workspaceUuid: string };
    const { data: workspace } = useWorkspace(workspaceUuid);
    const dragOriginPosition = useRef<DragOriginPosition | null>(null);
    const changeTaskPositionMutation = useChangeTaskPosition();

    const moveTask = (
        workspace: WorkspaceWithColumnsAndTasks,
        event: any,
    ): WorkspaceWithColumnsAndTasks => {
        const { source, target } = event.operation;
        if (!source || !target) return workspace;

        if (target.type === "task") {
            const uuidsByColumn: Record<number, string[]> = {};
            const taskByUuid: Record<string, Task> = {};

            workspace.columns.forEach((column) => {
                uuidsByColumn[column.id] = column.tasks.map(
                    (task) => task.uuid,
                );
                column.tasks.forEach((task) => {
                    taskByUuid[task.uuid] = task;
                });
            });

            const moved = move(uuidsByColumn, event);

            return {
                ...workspace,
                columns: workspace.columns.map((column) => ({
                    ...column,
                    tasks: (moved[column.id] ?? [])
                        .map((uuid) => taskByUuid[uuid] ?? null)
                        .filter(Boolean),
                })),
            };
        }

        if (target.type === "column") {
            const sourceUuid = source.id as string;
            const targetColumnId = target.id as number;

            let sourceTask: Task | null = null;

            const filteredColumns = workspace.columns.map((column) => {
                const taskIndex = column.tasks.findIndex(
                    (task) => task.uuid === sourceUuid,
                );

                if (taskIndex === -1) return column;

                sourceTask = column.tasks[taskIndex];

                return {
                    ...column,
                    tasks: column.tasks.filter(
                        (_, index) => index !== taskIndex,
                    ),
                };
            });

            if (!sourceTask) return workspace;

            return {
                ...workspace,
                columns: filteredColumns.map((column) => {
                    if (column.id !== targetColumnId) return column;
                    return {
                        ...column,
                        tasks: [...column.tasks, sourceTask!],
                    };
                }),
            };
        }

        return workspace;
    };

    return (
        <Animations.FadeIn>
            <div className="flex-1 flex flex-col gap-y-3 overflow-hidden p-4">
                <div className="flex flex-col gap-y-2">
                    <Form.Actions>
                        <Link to={"manage"}>
                            <Form.Button
                                text="Manage workspace"
                                icon={<PenLine size={18} />}
                                appearance={ButtonAppearance.bordered}
                            />
                        </Link>
                        <Link to={"tasks/new"}>
                            <Form.Button
                                text="Create a task"
                                icon={<LayersPlus size={18} />}
                                appearance={ButtonAppearance.filled}
                            />
                        </Link>
                    </Form.Actions>
                    <Form.Actions>
                        <ToggleColumnDropdown />
                    </Form.Actions>
                </div>
                <div className="flex-1 flex overflow-hidden text-white px-8">
                    <div className="flex-1 grid grid-flow-col auto-cols-max gap-x-10 overflow-auto p-1">
                        <DragDropProvider
                            onDragStart={(event) => {
                                if (event.operation.source) {
                                    const source = event.operation
                                        .source as any;

                                    dragOriginPosition.current = {
                                        index: source.data.position,
                                        columnId: source.group as number,
                                        taskUuid: source.id as string,
                                    };
                                }
                            }}
                            onDragOver={(event) => {
                                if (event.operation.source?.type === "column") {
                                    return;
                                }

                                event.preventDefault();

                                queryClient.setQueryData(
                                    ["workspaces", workspace.uuid],
                                    (prev: WorkspaceWithColumnsAndTasks) =>
                                        moveTask(prev, event),
                                );
                            }}
                            onDragEnd={(event) => {
                                const source = event.operation.source as any;

                                if (
                                    dragOriginPosition.current &&
                                    source &&
                                    dragOriginPosition.current.taskUuid ===
                                        source?.id
                                ) {
                                    const column = workspace.columns.find(
                                        (column) => column.id === source.group,
                                    );

                                    if (!column) return;

                                    const data = {
                                        column_id_from:
                                            dragOriginPosition.current.columnId,
                                        column_id_to: column.id,
                                        old_position_in_column:
                                            dragOriginPosition.current.index,
                                        new_position_in_column:
                                            column.tasks.length -
                                            1 -
                                            source.index,
                                    };

                                    if (
                                        data.column_id_from ===
                                            data.column_id_to &&
                                        data.old_position_in_column ===
                                            data.new_position_in_column
                                    )
                                        return;

                                    changeTaskPositionMutation.mutate({
                                        workspaceUuid,
                                        taskUuid:
                                            dragOriginPosition.current.taskUuid,
                                        data,
                                    });
                                }
                            }}
                        >
                            {workspace.columns.map(
                                (column: ColumnForWorkspace) =>
                                    column.pivot.visible ? (
                                        <WorkspaceColumn
                                            key={column.id}
                                            id={column.id}
                                            name={column.name}
                                            tasks={column.tasks}
                                        />
                                    ) : null,
                            )}
                        </DragDropProvider>
                    </div>
                </div>
            </div>
        </Animations.FadeIn>
    );
};

export default SingleWorkspace;
