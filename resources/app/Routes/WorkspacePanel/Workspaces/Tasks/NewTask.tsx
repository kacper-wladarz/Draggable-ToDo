import { SubmitEvent, useState } from "react";
import {
    useWorkspaceVisibleColumns,
    useWorkspace,
} from "../../../../Tanstack/Workspace/WorkspaceQueries";
import { useNavigate, useParams } from "react-router";
import { useCreateTask } from "../../../../Tanstack/Task/TaskMutations";
import { useQueryClient } from "@tanstack/react-query";
import Animations from "../../../../Components/Animations";
import Form from "../../../../Components/WorkspacePanel/ResourceForm";
import ReturnToPage from "../../../../Components/Routing/ReturnToPage";
import { ButtonAppearance } from "../../../../Components/WorkspacePanel/ResourceForm/FormButton";

const NewTask = () => {
    const [newTask, setNewTask] = useState<NewTask>({
        title: "",
        column: null,
    });
    const [errors, setErrors] = useState<NewTaskErrors>({});
    const { workspaceUuid } = useParams() as { workspaceUuid: string };
    const { data: visibleColumns = [] } =
        useWorkspaceVisibleColumns(workspaceUuid);
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
                    exact: true,
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
                <ReturnToPage
                    url={`/workspaces/${workspaceUuid}`}
                    text={workspace.name}
                    className="p-4"
                />
                <Form onSubmit={handleCreateTask} className="p-10">
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
                        <Form.Button
                            text={"Clear"}
                            type="button"
                            onClick={clear}
                            appearance={ButtonAppearance.bordered}
                        />
                        <Form.Button
                            text={"Create"}
                            type="submit"
                            disabled={createTask.isPending}
                            appearance={ButtonAppearance.filled}
                        />
                    </Form.Actions>
                </Form>
            </div>
        </Animations.FadeIn>
    );
};

export default NewTask;
