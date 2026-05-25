import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import Loadable from "./Components/LoadableRoute";
import GuessRoute from "./Components/Routing/GuessRoute";
import ProtectedRoute from "./Components/Routing/ProtectedRoute";
import { AuthContextProvider } from "./Providers/Auth/AuthContext";
import SingleWorkspace from "./Routes/WorkspacePanel/Workspaces/SingleWorkspace";

const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: 0 } },
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
                                path: ":workspaceUUID",
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
                <RouterProvider router={router} />
            </AuthContextProvider>
        </QueryClientProvider>
    );
};

export default App;
