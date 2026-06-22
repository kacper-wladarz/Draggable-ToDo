import { useDroppable } from "@dnd-kit/react";
import { memo } from "react";
import { CollisionPriority } from "@dnd-kit/abstract";
import WorkspaceColumnItem from "./WorkspaceColumnItem";

const WorkspaceColumn = memo(function Column({
    id,
    name,
    tasks,
}: {
    id: number;
    name: string;
    tasks: Task[];
}) {
    const { ref } = useDroppable({
        id,
        type: "column",
        accept: "task",
        collisionPriority: CollisionPriority.Low,
    });

    return (
        <div
            ref={ref}
            className="flex flex-col items-center gap-y-6 rounded-lg p-4 min-w-50 max-w-70 shadow-[0_0_5px_-3px_rgba(255,255,255,1)]"
        >
            <div className="text-xl text-white font-medium">{name}</div>

            <div className="flex flex-1 flex-col gap-y-3 w-full min-h-10">
                {tasks.map((task, index) => (
                    <WorkspaceColumnItem
                        key={task.uuid}
                        taskUuid={task.uuid}
                        taskName={task.title}
                        index={index}
                        columnId={id}
                        position={tasks.length - 1 - index}
                    />
                ))}
            </div>
        </div>
    );
});

export default WorkspaceColumn;
