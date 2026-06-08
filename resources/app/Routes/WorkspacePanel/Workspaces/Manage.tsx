import Animations from "../../../Components/Animations";
import ReturnToPage from "../../../Components/Routing/ReturnToPage";
import { useNavigate, useParams } from "react-router";
import { useWorkspace } from "../../../Tanstack/Workspace/WorkspaceQueries";
import Form from "../../../Components/WorkspacePanel/ResourceForm";
import { Trash } from "lucide-react";
import {
    ButtonAppearance,
    ButtonVariant,
} from "../../../Components/WorkspacePanel/ResourceForm/FormButton";
import { useMemo, useState } from "react";
import { useUpdateWorkspace } from "../../../Tanstack/Workspace/WorkspaceMutations";
import { useQueryClient } from "@tanstack/react-query";
import DeleteModal from "../../../Components/WorkspacePanel/DeleteModal";

const Manage = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { workspaceUuid } = useParams() as { workspaceUuid: string };
    const { data: workspace } = useWorkspace(workspaceUuid);
    const [workspaceData, setWorkspaceData] = useState<NewWorkspace>({
        name: workspace.name,
    });
    const [prevData, setPrevData] = useState<NewWorkspace>(workspaceData);
    const updateWorkspace = useUpdateWorkspace(workspaceUuid);
    const [errors, setErrors] = useState<NewWorkspaceErrors>({});
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const isDataChanged = useMemo(() => {
        let isChanged = false;

        Object.entries(prevData).map(([key, value]) => {
            if (value !== workspaceData[key as keyof NewWorkspace])
                isChanged = true;
        });

        return isChanged;
    }, [workspaceData, prevData]);

    const handleUpdateWorkspace = (
        event: React.SubmitEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();
        setErrors({});

        updateWorkspace.mutate(workspaceData, {
            onSuccess: (res) => {
                queryClient.setQueryData(
                    ["workspaces"],
                    (prev: Workspace[]) => {
                        if (!prev) return [];

                        return prev.map((workspace) => {
                            if (workspace.uuid !== res.uuid) return workspace;

                            return {
                                ...workspace,
                                name: res.name,
                            };
                        });
                    },
                );
                queryClient.setQueryData(
                    ["workspaces", workspaceUuid],
                    (prev: WorkspaceWithColumnsAndTasks) => {
                        return { ...prev, name: res.name };
                    },
                );
                setPrevData(workspaceData);
                navigate(`/workspaces/${workspace.uuid}`);
            },
            onError: (error) => {
                setErrors(error.data.errors);
            },
        });
    };

    const handleResetChanges = () => {
        setWorkspaceData(prevData);
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
                            text="Delete workspace"
                            icon={<Trash size={18} />}
                            appearance={ButtonAppearance.filled}
                            variant={ButtonVariant.delete}
                            onClick={() => setIsModalOpen(true)}
                        />
                        <DeleteModal
                            isOpen={isModalOpen}
                            setIsOpen={setIsModalOpen}
                            workspace={workspace}
                        />
                    </Form.Actions>
                </div>
                <Form className="p-10" onSubmit={handleUpdateWorkspace}>
                    <Form.Header>Manage your workspace</Form.Header>
                    <Form.Input
                        label="Name"
                        type="text"
                        errors={errors.name}
                        value={workspaceData.name}
                        placeholder="Enter workspace name"
                        onChange={(event) =>
                            setWorkspaceData((prev) => ({
                                ...prev,
                                name: event.target.value,
                            }))
                        }
                    />
                    <Form.Actions>
                        <Form.Button
                            text="Discard changes"
                            appearance={ButtonAppearance.bordered}
                            disabled={
                                !isDataChanged || updateWorkspace.isPending
                            }
                            onClick={handleResetChanges}
                        />
                        <Form.Button
                            text="Save"
                            appearance={ButtonAppearance.filled}
                            disabled={
                                !isDataChanged || updateWorkspace.isPending
                            }
                        />
                    </Form.Actions>
                </Form>
            </div>
        </Animations.FadeIn>
    );
};

export default Manage;
