import { useNavigate, useParams } from "react-router";
import Animations from "../../../../Components/Animations";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import ReturnToPage from "../../../../Components/Routing/ReturnToPage";
import Form from "../../../../Components/WorkspacePanel/ResourceForm";
import { Trash } from "lucide-react";
import {
    ButtonAppearance,
    ButtonVariant,
} from "../../../../Components/WorkspacePanel/ResourceForm/FormButton";
import { useWorkspace } from "../../../../Tanstack/Workspace/WorkspaceQueries";
import { useUpdateTask } from "../../../../Tanstack/Task/TaskMutations";
import DeleteTask from "../../../../Components/WorkspacePanel/DeleteTask";

const ManageTask = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { workspaceUuid, taskUuid } = useParams() as {
        workspaceUuid: string;
        taskUuid: string;
    };
    const { data: workspace } = useWorkspace(workspaceUuid);
    const updateTask = useUpdateTask();
    const [errors, setErrors] = useState<ManageTaskDataErrors>({});
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const task = useMemo(() => {
        for (const column of workspace.columns) {
            const task = column.tasks.find((task) => task.uuid === taskUuid);

            if (task) return task;
        }

        throw new Error("404");
    }, [workspace]);
    const [taskData, setTaskData] = useState<ManageTaskData>({
        title: task.title,
    });
    const [prevData, setPrevData] = useState<ManageTaskData>(taskData);

    const isDataChanged = useMemo(() => {
        let isChanged = false;

        Object.entries(prevData).map(([key, value]) => {
            if (value !== taskData[key as keyof ManageTaskData])
                isChanged = true;
        });

        return isChanged;
    }, [taskData, prevData]);

    useEffect(() => {
        setTaskData({ title: task.title });
        setPrevData({ title: task.title });
    }, [workspace.name]);

    const handleUpdateWorkspace = (
        event: React.SubmitEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();
        setErrors({});

        updateTask.mutate(
            {
                workspaceUuid: workspaceUuid,
                taskUuid: taskUuid,
                data: taskData,
            },
            {
                onSuccess: (res) => {
                    queryClient.setQueryData(
                        ["workspaces", workspaceUuid],
                        (prev: WorkspaceWithColumnsAndTasks) => {
                            return {
                                ...prev,
                                columns: prev.columns.map((column) => {
                                    return {
                                        ...column,
                                        tasks: column.tasks.map((task) => {
                                            if (task.uuid !== res.uuid)
                                                return task;
                                            return res;
                                        }),
                                    };
                                }),
                            };
                        },
                    );
                    setPrevData(taskData);
                    navigate(`/workspaces/${workspace.uuid}`);
                },
                onError: (error) => {
                    setErrors(error.data.errors);
                },
            },
        );
    };

    const handleResetChanges = () => {
        setTaskData(prevData);
        setErrors({});
    };

    return (
        <Animations.FadeIn>
            <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between gap-x-4 p-4">
                    <ReturnToPage
                        url={`/workspaces/${workspaceUuid}`}
                        text={workspace.name}
                    />
                    <Form.Actions>
                        <Form.Button
                            text="Delete task"
                            icon={<Trash size={18} />}
                            appearance={ButtonAppearance.filled}
                            variant={ButtonVariant.delete}
                            onClick={() => setIsModalOpen(true)}
                        />
                        <DeleteTask
                            isOpen={isModalOpen}
                            setIsOpen={setIsModalOpen}
                            workspaceUuid={workspaceUuid}
                            task={task}
                        />
                    </Form.Actions>
                </div>
                <Form className="p-10" onSubmit={handleUpdateWorkspace}>
                    <Form.Header>Manage your task</Form.Header>
                    <Form.Input
                        label="Title"
                        type="text"
                        errors={errors.title}
                        value={taskData.title}
                        placeholder="Enter task title"
                        onChange={(event) =>
                            setTaskData((prev) => ({
                                ...prev,
                                title: event.target.value,
                            }))
                        }
                    />
                    <Form.Actions>
                        <Form.Button
                            text="Discard changes"
                            appearance={ButtonAppearance.bordered}
                            disabled={!isDataChanged || updateTask.isPending}
                            onClick={handleResetChanges}
                        />
                        <Form.Button
                            text="Save"
                            appearance={ButtonAppearance.filled}
                            disabled={!isDataChanged || updateTask.isPending}
                        />
                    </Form.Actions>
                </Form>
            </div>
        </Animations.FadeIn>
    );
};

export default ManageTask;
