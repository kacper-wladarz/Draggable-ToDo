import { Trash2 } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import Modal from "../Modal";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteTask } from "../../Tanstack/Task/TaskMutations";

interface Props {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    workspaceUuid: string;
    task: Task;
}

const DeleteTask = ({ isOpen, setIsOpen, workspaceUuid, task }: Props) => {
    const queryClient = useQueryClient();
    const [titleConfirmation, setTitleConfirmation] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const deleteTask = useDeleteTask();
    const navigate = useNavigate();

    const handleCancelClick = () => {
        setIsOpen(false);
        setTimeout(() => {
            setError(null);
            setTitleConfirmation("");
        }, 300);
    };

    const handleDeleteClick = () => {
        if (task.title !== titleConfirmation) {
            setError(
                "The confirmation title must be the same as the task title",
            );
            return;
        }

        deleteTask.mutate(
            {
                workspaceUuid,
                taskUuid: task.uuid,
            },
            {
                onSuccess: () => {
                    setIsOpen(false);
                    setError(null);
                    setTitleConfirmation("");

                    queryClient.setQueryData(
                        ["workspaces", workspaceUuid],
                        (prev: WorkspaceWithColumnsAndTasks) => {
                            return {
                                ...prev,
                                columns: prev.columns.map((column) => {
                                    return {
                                        ...column,
                                        tasks: column.tasks.filter(
                                            (prevTask) =>
                                                prevTask.uuid !== task.uuid,
                                        ),
                                    };
                                }),
                            };
                        },
                    );

                    navigate(`/workspaces/${workspaceUuid}`, { replace: true });
                },
                onError: () => {
                    window.alert("An error occured while deleting the task");
                },
            },
        );
    };

    return (
        <Modal isOpen={isOpen} close={() => setIsOpen(false)}>
            <Modal.Header
                title="Delete task"
                icon={<Trash2 className="text-orange-600" size={18} />}
            />
            <Modal.Body>
                <Modal.Body.Warning
                    message={
                        <>
                            This operation is irreversible. Task{" "}
                            <b className="text-orange-500/90">{task.title}</b>{" "}
                            will be deleted.
                        </>
                    }
                />
                <div className="flex flex-col gap-y-1">
                    <span className="text-orange-100/60 font-light">
                        Task title
                    </span>
                    <input
                        value={task.title}
                        className="outline-none text-orange-300/60 font-medium border border-orange-900 rounded-lg px-2 py-1 bg-orange-950/0"
                        disabled
                    />
                </div>
                <div className="flex flex-col gap-y-1">
                    <span className="text-orange-100/60 font-light">
                        Enter task title to confirm
                    </span>
                    <input
                        placeholder={task.title}
                        className="outline-none text-orange-300/60 font-medium border border-orange-900 rounded-lg px-2 py-1 bg-orange-950/0"
                        value={titleConfirmation}
                        onChange={(event) =>
                            setTitleConfirmation(event.target.value)
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
                        disabled={deleteTask.isPending}
                    >
                        <Trash2 size={20} />
                        Delete task
                    </button>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default DeleteTask;
