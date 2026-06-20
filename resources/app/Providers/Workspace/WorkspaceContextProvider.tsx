import { ReactNode, useState } from "react";
import { WorkspaceContext } from "./WorkspaceContext";

export const WorkspaceContextProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const [openedWorkspaceUuid, setOpenedWorkspaceUuid] = useState<
        string | null
    >(null);

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
