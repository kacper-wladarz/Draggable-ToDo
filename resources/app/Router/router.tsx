import { createBrowserRouter, Navigate } from "react-router";
import { lazy } from "react";
import GuessRoute from "../Components/Routing/GuessRoute";
import ProtectedRoute from "../Components/Routing/ProtectedRoute";
import WorkspaceErrorBoundary from "./Errors/WorkspaceErrorBoundary";

const Login = lazy(() => import("../Routes/Login/Login"));
const Registration = lazy(() => import("../Routes/Registration/Registration"));
const WorkspacePanel = lazy(
    () => import("../Routes/WorkspacePanel/WorkspacePanel"),
);
const WorkspacesIndex = lazy(() => import("../Routes/WorkspacePanel/Index"));
const NewWorkspace = lazy(
    () => import("../Routes/WorkspacePanel/Workspaces/NewWorkspace"),
);
const SingleWorkspace = lazy(
    () => import("../Routes/WorkspacePanel/Workspaces/SingleWorkspace"),
);
const NewTask = lazy(
    () => import("../Routes/WorkspacePanel/Workspaces/Tasks/NewTask"),
);
const Manage = lazy(() => import("../Routes/WorkspacePanel/Workspaces/Manage"));

export const router = createBrowserRouter([
    {
        element: <ProtectedRoute />,
        children: [
            {
                path: "/",
                element: <WorkspacePanel />,
                children: [
                    {
                        index: true,
                        element: <Navigate to={"/workspaces"} replace />,
                    },
                    {
                        path: "workspaces",
                        children: [
                            { index: true, element: <WorkspacesIndex /> },
                            { path: "new", element: <NewWorkspace /> },
                            {
                                path: ":workspaceUuid",
                                errorElement: <WorkspaceErrorBoundary />,
                                children: [
                                    {
                                        index: true,
                                        element: <SingleWorkspace />,
                                    },
                                    {
                                        path: "tasks/new",
                                        element: <NewTask />,
                                    },
                                    {
                                        path: "manage",
                                        element: <Manage />,
                                    },
                                ],
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
            { path: "/login", element: <Login /> },
            { path: "/registration", element: <Registration /> },
        ],
    },
]);
