import ReactDOM from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router";
import { AuthContextProvider } from "./Providers/Auth/AuthContext";
import Loadable from "./Components/LoadableRoute";
import { lazy } from "react";
import ProtectedRoute from "./Components/Routing/ProtectedRoute";
import GuessRoute from "./Components/Routing/GuessRoute";

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
    lazy(() => import("./Routes/WorkspacePanel/NewWorkspace/NewWorkspace")),
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
                        path: "/create-workspace",
                        element: <NewWorkspace />,
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

const rootElement = document.getElementById("root");
if (rootElement && !rootElement._reactRootContainer) {
    ReactDOM.createRoot(rootElement).render(
        <QueryClientProvider client={queryClient}>
            <AuthContextProvider>
                <RouterProvider router={router} />
            </AuthContextProvider>
        </QueryClientProvider>,
    );
}
