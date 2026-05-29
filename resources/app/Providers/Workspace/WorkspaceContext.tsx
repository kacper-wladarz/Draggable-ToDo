import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import { useWorkspaces } from "../../Tanstack/Workspace/WorkspaceQueries";
import { useAuthContext } from "../Auth/AuthContext";

const WorkspaceContext = createContext<WorkspaceContext>(
    {} as WorkspaceContext,
);

export const WorkspaceContextProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const { user } = useAuthContext();
    const [openedWorkspaceUuid, setOpenedWorkspaceUuid] = useState<
        string | null
    >(null);

    const { data: rawWorkspacesList = [] } = useWorkspaces(!!user);

    const [workspacesList, setWorkspacesList] = useState<Workspace[]>([]);

    useEffect(() => {
        setWorkspacesList(
            rawWorkspacesList.sort((a, b) => b.position - a.position),
        );
    }, [rawWorkspacesList]);

    const addWorkspaceToList = (workspace: Workspace) => {
        setWorkspacesList((prev) => [workspace, ...prev]);
    };

    return (
        <WorkspaceContext.Provider
            value={{
                openedWorkspaceUuid,
                setOpenedWorkspaceUuid,
                workspacesList,
                setWorkspacesList,
                addWorkspaceToList,
            }}
        >
            {children}
        </WorkspaceContext.Provider>
    );
};

export const useWorkspaceContext = () => {
    const context = useContext(WorkspaceContext);
    if (!context)
        throw new Error(
            "useWorkspaceContext must be used within a WorkspaceContextProvider",
        );
    return context;
};
