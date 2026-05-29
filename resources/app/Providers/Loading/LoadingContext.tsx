import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import LoaderIcon from "../../Assets/LoaderIcon";
import { useAuthContext } from "../Auth/AuthContext";
import { useWorkspaceContext } from "../Workspace/WorkspaceContext";

const LoadingContext = createContext<LoadingContext>({} as LoadingContext);

export const LoadingContextProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const { isLoading: isAuthLoading, user } = useAuthContext();

    //Other contexts
    const { isLoading: areWorkspacesLoading } = useWorkspaceContext();

    //Array of loading contexts
    const loadingQueries = [areWorkspacesLoading];
    const areQueriesFetching = loadingQueries.some((isLoading) => isLoading);

    //Is app still loading
    const isAppLoading = isAuthLoading || (!!user && areQueriesFetching);

    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if (!isAppLoading) {
            const timer = setTimeout(() => setVisible(false), 500);
            return () => clearTimeout(timer);
        } else {
            setVisible(true);
        }
    }, [isAppLoading]);

    return (
        <LoadingContext.Provider value={{ isAppLoading }}>
            {visible && (
                <div
                    className={`z-50 fixed inset-0 flex justify-center items-center transition-opacity duration-500 bg-[var(--color-bg)] ${
                        isAppLoading
                            ? "opacity-100"
                            : "opacity-0 pointer-events-none"
                    }`}
                >
                    <LoaderIcon />
                </div>
            )}
            <div
                className={`h-full transition-opacity duration-500 ${
                    isAppLoading ? "opacity-0" : "opacity-100"
                }`}
            >
                {children}
            </div>
        </LoadingContext.Provider>
    );
};

export const useLoadingContext = () => {
    const context = useContext(LoadingContext);

    if (!context) {
        throw new Error(
            "useLoadingContxet must be used within a LoadingContextProvider",
        );
    }

    return context;
};
