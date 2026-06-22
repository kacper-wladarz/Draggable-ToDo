import { Dispatch, SetStateAction, useState } from "react";
import Modal from "../Modal";
import { Trash2 } from "lucide-react";
import { useDeleteWorkspace } from "../../Tanstack/Workspace/WorkspaceMutations";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    workspace: WorkspaceWithColumnsAndTasks;
}

const DeleteModal = ({ isOpen, setIsOpen, workspace }: Props) => {
    const queryClient = useQueryClient();
    const [nameConfirmation, setNameConfirmation] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const deleteWorkspace = useDeleteWorkspace();
    const navigate = useNavigate();

    const handleCancelClick = () => {
        setIsOpen(false);
        setTimeout(() => {
            setError(null);
            setNameConfirmation("");
        }, 300);
    };

    const handleDeleteClick = () => {
        if (workspace.name !== nameConfirmation) {
            setError(
                "The confirmation name must be the same as the workspace name",
            );
            return;
        }

        deleteWorkspace.mutate(workspace.uuid, {
            onSuccess: () => {
                setIsOpen(false);
                setError(null);
                setNameConfirmation("");

                queryClient.setQueryData(
                    ["workspaces"],
                    (prev: Workspace[] = []) => {
                        return prev.filter(
                            (item: Workspace) => item.uuid !== workspace.uuid,
                        );
                    },
                );

                navigate("/workspaces", { replace: true });
            },
            onError: () => {
                window.alert("An error occured while deleting the workspace");
            },
        });
    };

    return (
        <Modal isOpen={isOpen} close={() => setIsOpen(false)}>
            <Modal.Header
                title="Delete workspace"
                icon={<Trash2 className="text-orange-600" size={18} />}
            />
            <Modal.Body>
                <Modal.Body.Warning
                    message={
                        <>
                            This operation is irreversible. All tasks assigned
                            to{" "}
                            <b className="text-orange-500/90">
                                {workspace.name}
                            </b>{" "}
                            workspace will be deleted.
                        </>
                    }
                />
                <div className="flex flex-col gap-y-1">
                    <span className="text-orange-100/60 font-light">
                        Workspace name
                    </span>
                    <input
                        value={workspace.name}
                        className="outline-none text-orange-300/60 font-medium border border-orange-900 rounded-lg px-2 py-1 bg-orange-950/0"
                        disabled
                    />
                </div>
                <div className="flex flex-col gap-y-1">
                    <span className="text-orange-100/60 font-light">
                        Enter workspace name to confirm
                    </span>
                    <input
                        placeholder={workspace.name}
                        className="outline-none text-orange-300/60 font-medium border border-orange-900 rounded-lg px-2 py-1 bg-orange-950/0"
                        value={nameConfirmation}
                        onChange={(event) =>
                            setNameConfirmation(event.target.value)
                        }
                    />
                    <span
                        className={`w-full auto_size ${error ? "h-auto" : "h-0"} transition-all duration-200 overflow-hidden text-orange-200 font-medium text-sm text-center`}
                    >
                        {error || "\u00A0"}
                    </span>
                </div>
                <div className="flex items-center gap-x-2">
                    <button
                        className="flex-1 border border-orange-900 rounded-lg text-orange-100/60 text-lg py-1.5 font-medium cursor-pointer hover:bg-orange-950/60 transition-[background-color] duration-200"
                        onClick={handleCancelClick}
                    >
                        Cancel
                    </button>
                    <button
                        className="flex-1 rounded-ld py-1.5 text-lg bg-red-600 rounded-lg text-white/80 font-medium cursor-pointer hover:bg-red-700 transition-[background-color] duration-200 flex items-center justify-center gap-x-1 disabled:opacity-70 disabled:cursor-default disabled:hover:bg-red-600"
                        onClick={handleDeleteClick}
                        disabled={deleteWorkspace.isPending}
                    >
                        <Trash2 size={20} />
                        Delete workspace
                    </button>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default DeleteModal;
