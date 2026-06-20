import { useParams } from "react-router";
import { useWorkspace } from "../../Tanstack/Workspace/WorkspaceQueries";
import { useState } from "react";
import { Columns3, Eye, EyeOff } from "lucide-react";
import { useToggleColumnVisibility } from "../../Tanstack/Workspace/WorkspaceMutations";
import { useQueryClient } from "@tanstack/react-query";

const ToggleColumnDropdown = () => {
    const queryClient = useQueryClient();
    const { workspaceUuid } = useParams() as { workspaceUuid: string };
    const { data: workspace } = useWorkspace(workspaceUuid);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const toggleColumnVisibility = useToggleColumnVisibility();

    const handleColumnButtonClick = (
        columnId: number,
        newVisibility: boolean,
    ) => {
        setIsOpen(false);
        toggleColumnVisibility.mutate(
            {
                uuid: workspaceUuid,
                column_id: columnId,
                visible: newVisibility,
            },
            {
                onSuccess: () => {
                    queryClient.setQueryData(
                        ["workspaces", workspaceUuid],
                        (prev: WorkspaceWithColumnsAndTasks) => {
                            return {
                                ...prev,
                                columns: prev.columns.map((column) => {
                                    if (column.id !== columnId) return column;
                                    return {
                                        ...column,
                                        pivot: {
                                            visible: !column.pivot.visible,
                                        },
                                    };
                                }),
                            };
                        },
                    );
                },
                onError: (err) => {
                    window.alert(err.data.message);
                },
            },
        );
    };

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <Columns3 className="text-white/80 cursor-pointer" />
            <div
                className={`auto_size absolute top-full right-0 text-white/80 overflow-hidden ${isOpen ? "h-auto opacity-100" : "h-0 opacity-60"} transition-[height,opacity] duration-300`}
            >
                <div className="mt-2 rounded-md overflow-hidden">
                    {workspace.columns.map((column) => (
                        <button
                            className={`w-full outline-none px-2 py-1 font-medium flex items-center gap-x-2 transition-[background] duration-200 cursor-pointer ${column.pivot.visible ? "bg-orange-600 hover:bg-orange-700" : "bg-orange-800 hover:bg-orange-900"}`}
                            key={`column-${column.id}`}
                            onClick={() =>
                                handleColumnButtonClick(
                                    column.id,
                                    !column.pivot.visible,
                                )
                            }
                        >
                            {column.pivot.visible ? (
                                <Eye size={20} />
                            ) : (
                                <EyeOff size={20} />
                            )}
                            <span className="whitespace-nowrap">
                                {column.name}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ToggleColumnDropdown;
