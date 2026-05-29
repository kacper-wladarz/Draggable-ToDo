import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import Loadable from "./Components/Loadable";
import GuessRoute from "./Components/Routing/GuessRoute";
import ProtectedRoute from "./Components/Routing/ProtectedRoute";
import { AuthContextProvider } from "./Providers/Auth/AuthContext";
import { WorkspaceContextProvider } from "./Providers/Workspace/WorkspaceContext";
import { LoadingContextProvider } from "./Providers/Loading/LoadingContext";

const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: 0, refetchOnWindowFocus: false } },
});

const WorkspacePanel = Loadable(
    lazy(() => import("./Routes/WorkspacePanel/WorkspacePanel")),
);
const WorkspaceIndex = Loadable(
    lazy(() => import("./Routes/WorkspacePanel/Index")),
);
const NewWorkspace = Loadable(
    lazy(() => import("./Routes/WorkspacePanel/Workspaces/NewWorkspace")),
);
const SingleWorkspace = Loadable(
    lazy(() => import("./Routes/WorkspacePanel/Workspaces/SingleWorkspace")),
);
const Login = Loadable(lazy(() => import("./Routes/Login/Login")));
const Registration = Loadable(
    lazy(() => import("./Routes/Registration/Registration")),
);

const router = createBrowserRouter([
    {
        element: <ProtectedRoute />,
        children: [
            {
                path: "/",
                element: <WorkspacePanel />,
                children: [
                    {
                        index: true,
                        element: <WorkspaceIndex />,
                    },
                    {
                        path: "workspaces",
                        children: [
                            {
                                path: "new",
                                element: <NewWorkspace />,
                            },
                            {
                                path: ":workspaceUuid",
                                element: <SingleWorkspace />,
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        element: <GuessRoute />,
        children: [
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/registration",
                element: <Registration />,
            },
        ],
    },
]);

const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthContextProvider>
                <WorkspaceContextProvider>
                    <LoadingContextProvider>
                        <RouterProvider router={router} />
                    </LoadingContextProvider>
                </WorkspaceContextProvider>
            </AuthContextProvider>
        </QueryClientProvider>
    );
};

export default App;
