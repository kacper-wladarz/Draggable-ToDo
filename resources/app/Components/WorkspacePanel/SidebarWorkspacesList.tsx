import { useDragDropMonitor } from "@dnd-kit/react";
import { useWorkspaceContext } from "../../Providers/Workspace/WorkspaceContext";
import SortableWorkspaceItem from "./SortableWorkspaceItem";
import { isSortable } from "@dnd-kit/react/sortable";
import { useChangeWorkspacePosition } from "../../Tanstack/Workspace/WorkspaceMutations";

const SidebarWorkspacesList = () => {
    const { workspacesList, setWorkspacesList } = useWorkspaceContext();
    const changePosition = useChangeWorkspacePosition();

    useDragDropMonitor({
        onDragEnd(event) {
            const { source } = event.operation;

            if (isSortable(source)) {
                const { initialIndex, index } = source;

                if (initialIndex !== index) {
                    changePosition.mutate({
                        uuid: source.id as string,
                        position_from: workspacesList.length - initialIndex - 1,
                        position_to: workspacesList.length - index - 1,
                    });

                    setWorkspacesList((prev) => {
                        const newItems = [...prev];
                        const [removed] = newItems.splice(initialIndex, 1);
                        newItems.splice(index, 0, removed);
                        return newItems;
                    });
                }
            }
        },
    });

    return (
        <ul className="text-white py-1 flex flex-col gap-y-1.5 overflow-y-auto pl-4 pr-4">
            {workspacesList.map((workspace, index) => (
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
