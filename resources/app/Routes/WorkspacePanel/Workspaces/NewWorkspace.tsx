import { SubmitEvent, useState } from "react";
import { useCreateWorkspace } from "../../../Tanstack/Workspace/WorkspaceMutations";
import { useNavigate } from "react-router";
import { useWorkspaceContext } from "../../../Providers/Workspace/WorkspaceContext";
import { useQueryClient } from "@tanstack/react-query";
import Animations from "../../../Components/Animations";
import Form from "../../../Components/WorkspacePanel/ResourceForm";

const NewWorkspace = () => {
    const queryClient = useQueryClient();

    const [newWorkspace, setNewWorkspace] = useState<NewWorkspace>({
        name: "",
    });
    const [errors, setErrors] = useState<NewWorkspaceErrors>({});
    const createWorkspace = useCreateWorkspace();
    const navigate = useNavigate();
    const { addWorkspaceToList } = useWorkspaceContext();

    const clear = () => {
        setNewWorkspace({
            name: "",
        });
        setErrors({});
    };

    const handleCreateWorkspace = (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrors({});

        createWorkspace.mutate(newWorkspace, {
            onSuccess: (workspace) => {
                addWorkspaceToList(workspace);
                queryClient.invalidateQueries({
                    queryKey: ["workspaces", true],
                });
                navigate(`/workspaces/${workspace.uuid}`);
            },
            onError: (err) => {
                setErrors(err.data.errors);
            },
        });
    };

    return (
        <Animations.FadeIn>
            <Form onSubmit={handleCreateWorkspace}>
                <Form.Input
                    label="Project name"
                    errors={errors.name}
                    type="text"
                    placeholder="Enter workspace name"
                    value={newWorkspace.name}
                    onChange={(event) =>
                        setNewWorkspace((prev) => ({
                            ...prev,
                            name: event.target.value,
                        }))
                    }
                />
                <Form.Actions>
                    <Form.BorderButton
                        text={"Clear"}
                        type="button"
                        onClick={clear}
                    />
                    <Form.BorderButton
                        text={"Create"}
                        type="submit"
                        disabled={createWorkspace.isPending}
                    />
                </Form.Actions>
            </Form>
        </Animations.FadeIn>
    );
};

export default NewWorkspace;
