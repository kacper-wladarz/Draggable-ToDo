import { SubmitEvent, useState } from "react";
import {
    useWorksaceVisibleColumns,
    useWorkspace,
} from "../../../../Tanstack/Workspace/WorkspaceQueries";
import { useNavigate, useParams } from "react-router";
import { useCreateTask } from "../../../../Tanstack/Task/TaskMutations";
import { useQueryClient } from "@tanstack/react-query";
import Animations from "../../../../Components/Animations";
import Form from "../../../../Components/WorkspacePanel/ResourceForm";
import { Undo2 } from "lucide-react";

const NewTask = () => {
    const [newTask, setNewTask] = useState<NewTask>({
        title: "",
        column: null,
    });
    const [errors, setErrors] = useState<NewTaskErrors>({});
    const { workspaceUuid } = useParams() as { workspaceUuid: string };
    const { data: visibleColumns = [] } =
        useWorksaceVisibleColumns(workspaceUuid);
    const { data: workspace } = useWorkspace(workspaceUuid);
    const createTask = useCreateTask(workspaceUuid);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const handleCreateTask = (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrors({});

        createTask.mutate(newTask, {
            onSuccess: () => {
                navigate(`/workspaces/${workspaceUuid}`);
                queryClient.resetQueries({
                    queryKey: ["workspaces", workspaceUuid],
                });
            },
            onError: (error) => {
                setErrors(error.data.errors);
            },
        });
    };

    const clear = () => {
        setNewTask({
            title: "",
            column: null,
        });
        setErrors({});
    };

    return (
        <Animations.FadeIn>
            <div className="flex flex-col flex-1">
                <div className="text-white/40 flex items-center gap-x-1 font-medium p-4">
                    <Undo2 />
                    <span>{workspace.name}</span>
                </div>
                <Form onSubmit={handleCreateTask}>
                    <Form.Header>New Task</Form.Header>
                    <Form.Input
                        label="Task title"
                        errors={errors.title}
                        type="text"
                        placeholder="Enter task title"
                        value={newTask.title}
                        onChange={(event) =>
                            setNewTask((prev) => ({
                                ...prev,
                                title: event.target.value,
                            }))
                        }
                    />
                    <Form.Select<Column>
                        options={visibleColumns}
                        optionValue={(item) => item.id}
                        optionText={(item) => item.name}
                        option={newTask.column}
                        onOptionChange={(value) =>
                            setNewTask((prev) => ({ ...prev, column: value }))
                        }
                        label="Column"
                        placeholder="Select column"
                        errors={errors.column_id}
                    />
                    <Form.Actions>
                        <Form.BorderButton
                            text={"Clear"}
                            type="button"
                            onClick={clear}
                        />
                        <Form.FilledButton
                            text={"Create"}
                            type="submit"
                            disabled={createTask.isPending}
                        />
                    </Form.Actions>
                </Form>
            </div>
        </Animations.FadeIn>
    );
};

export default NewTask;
