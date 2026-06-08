import { Link, useParams } from "react-router";
import { useWorkspace } from "../../../Tanstack/Workspace/WorkspaceQueries";
import { useMemo } from "react";
import { DragDropProvider, useDroppable } from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/react/sortable";
import { CollisionPriority } from "@dnd-kit/abstract";
import Animations from "../../../Components/Animations";
import Form from "../../../Components/WorkspacePanel/ResourceForm";
import { LayersPlus, PenLine } from "lucide-react";
import { ButtonAppearance } from "../../../Components/WorkspacePanel/ResourceForm/FormButton";

const SingleWorkspace = () => {
    const { workspaceUuid } = useParams() as { workspaceUuid: string };
    const { data: rawWorkspace } = useWorkspace(workspaceUuid);

    const workspace = useMemo(
        () => ({
            ...rawWorkspace,
            columns: rawWorkspace.columns.map((column) => ({
                ...column,
                tasks: column.tasks.sort((a, b) => b.position - a.position),
            })),
        }),
        [rawWorkspace],
    );

    return (
        <Animations.FadeIn>
            <div className="flex-1 flex flex-col gap-y-3 overflow-hidden p-4">
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
                <div className="flex-1 flex overflow-hidden text-white px-8">
                    <div className="flex-1 grid grid-flow-col auto-cols-max gap-x-10 overflow-auto p-1">
                        <DragDropProvider
                            onDragEnd={(event) => {
                                const { source, target } = event.operation;
                                console.log("source id:", source?.id);
                                console.log("target id:", target?.id);
                                console.log("target type:", target?.type);
                                console.log("-----------------------------");
                            }}
                        >
                            {workspace?.columns.map((column: Column) => (
                                <Column
                                    key={column.id}
                                    id={column.id}
                                    name={column.name}
                                >
                                    {column.tasks.map(
                                        (task: Task, index: number) => (
                                            <Item
                                                key={task.uuid}
                                                taskUuid={task.uuid}
                                                taskName={task.title}
                                                index={index}
                                                column={column.id}
                                            />
                                        ),
                                    )}
                                </Column>
                            ))}
                        </DragDropProvider>
                    </div>
                </div>
            </div>
        </Animations.FadeIn>
    );
};

export default SingleWorkspace;

const Item = ({ taskUuid, taskName, index, column }) => {
    const { ref, isDragging } = useSortable({
        id: taskUuid,
        index,
        type: "item",
        accept: "item",
        group: column,
    });

    return (
        <div
            ref={ref}
            className="w-full bg-[#805802] rounded-md text-center text-white/70 select-none py-0.5 font-medium cursor-grab"
            data-dragging={isDragging}
        >
            {taskName}
        </div>
    );
};

const Column = ({ children, id, name }) => {
    const { ref, isDropTarget } = useDroppable({
        id,
        type: "column",
        accept: "item",
        collisionPriority: CollisionPriority.Normal,
    });

    return (
        <div
            className={`flex flex-col items-center gap-y-6 rounded-lg p-4 min-w-50 max-w-70 shadow-[0_0_5px_-3px_rgba(255,255,255,1)] ${isDropTarget ? "bg-[#1f1f20]" : "bg-[#151516]"} transition-[background-color] duration-200`}
            ref={ref}
        >
            <div className="text-xl text-white font-medium">{name}</div>
            <div className="flex flex-1 flex-col gap-y-3 w-full">
                {children}
            </div>
        </div>
    );
};
