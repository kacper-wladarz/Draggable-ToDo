import { useSortable } from "@dnd-kit/react/sortable";
import { useWorkspaceContext } from "../../Providers/Workspace/WorkspaceContext";
import { Link } from "react-router";
import { GripVertical } from "lucide-react";

interface Props {
    workspace: Workspace;
    index: number;
}

const SortableWorkspaceItem = ({ workspace, index }: Props) => {
    const { ref, handleRef, isDragging } = useSortable({
        id: workspace.uuid,
        index,
    });
    const { openedWorkspaceUuid, setOpenedWorkspaceUuid } =
        useWorkspaceContext();

    return (
        <li
            ref={ref}
            className={`font-light text-lg cursor-pointer hover:-translate-x-0.5 transition-[translate,background-color] duration-300 ${openedWorkspaceUuid === workspace.uuid ? "bg-[#101011]! shadow-[0_0_4px_-3px_rgba(255,255,255,1)]" : ""} rounded-md flex items-center justify-between bg-[#151516] ${isDragging ? "bg-orange-600!" : ""}`}
        >
            <Link
                to={`/workspaces/${workspace.uuid}`}
                className="w-full px-2 py-0.5 block truncate cursor-pointer text-left"
                title={workspace.name}
                onClick={() => {
                    setOpenedWorkspaceUuid(workspace.uuid);
                }}
            >
                {workspace.name}
            </Link>
            <span ref={handleRef} className="px-2 cursor-grab">
                <GripVertical size={20} />
            </span>
        </li>
    );
};

export default SortableWorkspaceItem;
