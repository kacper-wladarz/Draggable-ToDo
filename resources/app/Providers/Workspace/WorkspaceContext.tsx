import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import { useWorkspaces } from "../../Tanstack/Workspace/WorkspaceQueries";
import { useAuthContext } from "../Auth/AuthContext";

const WorkspaceContext = createContext<WorkspaceContext>({
    workspacesList: [],
    setWorkspacesList: () => {},
    openedWorkspaceUuid: null,
    setOpenedWorkspaceUuid: () => {},
    addWorkspaceToList: () => {},
    removeWorkspaceFromList: () => {},
});

export const WorkspaceContextProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const { token } = useAuthContext();
    const [openedWorkspaceUuid, setOpenedWorkspaceUuid] = useState<
        string | null
    >(null);

    const { data: rawWorkspacesList = [] } = useWorkspaces(!!token);

    const [workspacesList, setWorkspacesList] = useState<Workspace[]>([]);

    useEffect(() => {
        if (rawWorkspacesList) {
            setWorkspacesList(
                rawWorkspacesList.sort((a, b) => b.position - a.position),
            );
        }
    }, [rawWorkspacesList]);

    const addWorkspaceToList = (workspace: Workspace) => {
        setWorkspacesList((prev) => [workspace, ...prev]);
    };

    const removeWorkspaceFromList = (uuid: string) => {
        setWorkspacesList((prev) => prev.filter((item) => item.uuid !== uuid));
    };

    return (
        <WorkspaceContext.Provider
            value={{
                openedWorkspaceUuid,
                setOpenedWorkspaceUuid,
                workspacesList,
                setWorkspacesList,
                addWorkspaceToList,
                removeWorkspaceFromList,
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
