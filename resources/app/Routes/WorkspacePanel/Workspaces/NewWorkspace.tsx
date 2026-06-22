import { SubmitEvent, useState } from "react";
import { useCreateWorkspace } from "../../../Tanstack/Workspace/WorkspaceMutations";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import Animations from "../../../Components/Animations";
import Form from "../../../Components/WorkspacePanel/ResourceForm";
import { ButtonAppearance } from "../../../Components/WorkspacePanel/ResourceForm/FormButton";
import { useWorkspaceContext } from "../../../Providers/Workspace/useWorkspaceContext";

const NewWorkspace = () => {
    const queryClient = useQueryClient();

    const [newWorkspace, setNewWorkspace] = useState<NewWorkspace>({
        name: "",
    });
    const [errors, setErrors] = useState<NewWorkspaceErrors>({});
    const createWorkspace = useCreateWorkspace();
    const navigate = useNavigate();
    const { setOpenedWorkspaceUuid } = useWorkspaceContext();

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
                queryClient.setQueryData(
                    ["workspaces"],
                    (prev: Workspace[] = []) => [workspace, ...prev],
                );
                setOpenedWorkspaceUuid(workspace.uuid);
                navigate(`/workspaces/${workspace.uuid}`);
            },
            onError: (err) => {
                setErrors(err.data.errors);
            },
        });
    };

    return (
        <Animations.FadeIn>
            <Form onSubmit={handleCreateWorkspace} className="p-10">
                <Form.Header>New workspace</Form.Header>
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
                    <Form.Button
                        text={"Clear"}
                        type="button"
                        onClick={clear}
                        appearance={ButtonAppearance.bordered}
                    />
                    <Form.Button
                        text={"Create"}
                        type="submit"
                        disabled={createWorkspace.isPending}
                        appearance={ButtonAppearance.filled}
                    />
                </Form.Actions>
            </Form>
        </Animations.FadeIn>
    );
};

export default NewWorkspace;
