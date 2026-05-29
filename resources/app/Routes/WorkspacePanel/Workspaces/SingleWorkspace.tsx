import { useParams } from "react-router";
import { useWorkspace } from "../../../Tanstack/Workspace/WorkspaceQueries";
import { useEffect } from "react";
import { useWorkspaceContext } from "../../../Providers/Workspace/WorkspaceContext";

const SingleWorkspace = () => {
    const { workspaceUuid } = useParams() as { workspaceUuid: string };
    const { setOpenedWorkspaceUuid } = useWorkspaceContext();
    const { data: workspace } = useWorkspace(workspaceUuid);

    useEffect(() => {
        setOpenedWorkspaceUuid(workspaceUuid);

        return () => setOpenedWorkspaceUuid(null);
    }, [workspaceUuid]);

    return <div>SingleWorkspace</div>;
};

export default SingleWorkspace;
