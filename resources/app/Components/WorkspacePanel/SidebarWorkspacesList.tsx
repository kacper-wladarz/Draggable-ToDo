import { DragDropProvider } from "@dnd-kit/react";
import SortableWorkspaceItem from "./SortableWorkspaceItem";
import { isSortable } from "@dnd-kit/react/sortable";
import { useChangeWorkspacePosition } from "../../Tanstack/Workspace/WorkspaceMutations";
import { useWorkspaces } from "../../Tanstack/Workspace/WorkspaceQueries";

const SidebarWorkspacesList = () => {
    const { data: workspacesList } = useWorkspaces();
    const changePosition = useChangeWorkspacePosition();

    return (
        <DragDropProvider
            onDragEnd={(event) => {
                const { source } = event.operation;

                if (isSortable(source)) {
                    const { initialIndex, index } = source;

                    if (initialIndex !== index) {
                        changePosition.mutate({
                            uuid: source.id as string,
                            position_from:
                                workspacesList.length - initialIndex - 1,
                            position_to: workspacesList.length - index - 1,
                        });
                    }
                }
            }}
        >
            <ul className="text-white py-1 flex flex-col gap-y-1.5 overflow-y-auto pl-4 pr-4">
                {workspacesList.map((workspace, index) => (
                    <SortableWorkspaceItem
                        key={workspace.uuid}
                        workspace={workspace}
                        index={index}
                    />
                ))}
            </ul>
        </DragDropProvider>
    );
};

export default SidebarWorkspacesList;
