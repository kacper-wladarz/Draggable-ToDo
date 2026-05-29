import { SubmitEvent, useState } from "react";
import { useCreateWorkspace } from "../../../Tanstack/Workspace/WorkspaceMutations";
import FormActions from "../../../Components/WorkspacePanel/ResourceForm/FormActions";
import FormClearButton from "../../../Components/WorkspacePanel/ResourceForm/FormClearButton";
import FormConfirmButton from "../../../Components/WorkspacePanel/ResourceForm/FormConfirmButton";
import FormInput from "../../../Components/WorkspacePanel/ResourceForm/FormInput";
import { useNavigate } from "react-router";
import { useWorkspaceContext } from "../../../Providers/Workspace/WorkspaceContext";

const NewWorkspace = () => {
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
                navigate(`/workspaces/${workspace.uuid}`);
            },
            onError: (err) => setErrors(err.data.errors),
        });
    };

    return (
        <form
            className="p-10 flex flex-col gap-y-6"
            onSubmit={handleCreateWorkspace}
        >
            <FormInput
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
            <FormActions>
                <FormClearButton text={"Clear"} type="button" onClick={clear} />
                <FormConfirmButton
                    text={"Create"}
                    type="submit"
                    disabled={createWorkspace.isPending}
                />
            </FormActions>
        </form>
    );
};

export default NewWorkspace;
