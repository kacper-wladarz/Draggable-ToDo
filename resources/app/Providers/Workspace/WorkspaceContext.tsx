import { createContext, ReactNode, useContext, useState } from "react";
import { useWorkspaces } from "../../Tanstack/Workspace/WorkspaceQueries";
import { useAuthContext } from "../Auth/AuthContext";
import { useQueryClient } from "@tanstack/react-query";

const WorkspaceContext = createContext<WorkspaceContext>(
    {} as WorkspaceContext,
);

export const WorkspaceContextProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const queryClient = useQueryClient();
    const { user } = useAuthContext();
    const [openedWorkspaceUuid, setOpenedWorkspaceUuid] = useState<
        string | null
    >(null);

    const { data: workspacesList = [], isLoading } = useWorkspaces(!!user);

    const addWorkspaceToList = (workspace: Workspace) => {
        queryClient.setQueryData<Workspace[]>(["workspaces"], (prev) => {
            if (!prev) return [workspace];
            return [workspace, ...prev];
        });
    };

    return (
        <WorkspaceContext.Provider
            value={{
                openedWorkspaceUuid,
                setOpenedWorkspaceUuid,
                workspacesList,
                addWorkspaceToList,
                isLoading,
            }}
        >
            {children}
        </WorkspaceContext.Provider>
    );
};

export const useWorkspaceContext = () => {
    const context = useContext(WorkspaceContext);

    if (!context) {
        throw new Error(
            "useWorkspaceContext must be used within a WorkspaceContextProvider",
        );
    }

    return context;
};
