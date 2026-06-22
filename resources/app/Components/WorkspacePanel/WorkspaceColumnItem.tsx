import { useSortable } from "@dnd-kit/react/sortable";
import { ExternalLink } from "lucide-react";
import { memo } from "react";
import { Link } from "react-router";

interface Props {
    taskUuid: string;
    taskName: string;
    index: number;
    columnId: number;
    position: number;
}

const WorkspaceColumnItem = memo(function Item({
    taskUuid,
    taskName,
    index,
    columnId,
    position,
}: Props) {
    const { ref } = useSortable({
        id: taskUuid,
        index,
        type: "task",
        accept: "task",
        group: columnId,
        data: {
            position,
        },
    });

    return (
        <div
            ref={ref}
            className="w-full bg-[#805802] rounded-md text-center text-white/70 select-none font-medium cursor-grab flex items-center gap-x-1"
        >
            <Link to={`tasks/${taskUuid}`} className="flex items-center">
                <button className="cursor-pointer text-white/40 pl-0.75 py-0.75 hover:text-white transition-[color] duration-200">
                    <ExternalLink size={20} className="-rotate-90" />
                </button>
            </Link>
            <div className="min-w-0 overflow-hidden pr-1">
                <span
                    className="text-left block truncate text-sm"
                    title={taskName}
                >
                    {taskName}
                </span>
            </div>
        </div>
    );
});

export default WorkspaceColumnItem;
