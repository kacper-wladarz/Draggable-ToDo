import { useDragDropMonitor } from "@dnd-kit/react";
import { useWorkspaceContext } from "../../Providers/Workspace/WorkspaceContext";
import SortableWorkspaceItem from "./SortableWorkspaceItem";
import { isSortable } from "@dnd-kit/react/sortable";
import { useMemo } from "react";
import { useChangeWorkspacePosition } from "../../Tanstack/Workspace/WorkspaceMutations";

const SidebarWorkspacesList = () => {
    const { workspacesList } = useWorkspaceContext();
    const sortedList = useMemo(() => {
        return workspacesList.sort((a, b) => {
            if (a.position < b.position) return 1;
            return -1;
        });
    }, [workspacesList]);
    const changePosition = useChangeWorkspacePosition();

    useDragDropMonitor({
        onDragEnd(event) {
            const { source } = event.operation;

            if (isSortable(source)) {
                const { initialIndex, index } = source;

                if (initialIndex !== index) {
                    changePosition.mutate({
                        uuid: source.id as string,
                        position_from: sortedList.length - initialIndex - 1,
                        position_to: sortedList.length - index - 1,
                    });
                }
            }
        },
    });

    return (
        <ul className="text-white py-1 flex flex-col gap-y-1.5 overflow-y-auto pl-4 pr-4">
            {sortedList.map((workspace, index) => (
                <SortableWorkspaceItem
                    key={workspace.uuid}
                    workspace={workspace}
                    index={index}
                />
            ))}
        </ul>
    );
};

export default SidebarWorkspacesList;
