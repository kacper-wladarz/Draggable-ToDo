import { ReactNode, useState } from "react";
import { WorkspaceContext } from "./WorkspaceContext";
import { useWorkspaces } from "../../Tanstack/Workspace/WorkspaceQueries";
import { useAuthContext } from "../Auth/useAuthContext";

export const WorkspaceContextProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const [openedWorkspaceUuid, setOpenedWorkspaceUuid] = useState<
        string | null
    >(null);
    const { token } = useAuthContext();

    useWorkspaces(token);

    return (
        <WorkspaceContext.Provider
            value={{
                openedWorkspaceUuid,
                setOpenedWorkspaceUuid,
            }}
        >
            {children}
        </WorkspaceContext.Provider>
    );
};
