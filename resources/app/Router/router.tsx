import { createBrowserRouter } from "react-router";
import { lazy } from "react";
import GuessRoute from "../Components/Routing/GuessRoute";
import ProtectedRoute from "../Components/Routing/ProtectedRoute";

const Login = lazy(() => import("../Routes/Login/Login"));
const Registration = lazy(() => import("../Routes/Registration/Registration"));
const WorkspacePanel = lazy(
    () => import("../Routes/WorkspacePanel/WorkspacePanel"),
);
const Index = lazy(() => import("../Routes/WorkspacePanel/Index"));
const NewWorkspace = lazy(
    () => import("../Routes/WorkspacePanel/Workspaces/NewWorkspace"),
);
const SingleWorkspace = lazy(
    () => import("../Routes/WorkspacePanel/Workspaces/SingleWorkspace"),
);

export const router = createBrowserRouter([
    {
        element: <ProtectedRoute />,
        children: [
            {
                path: "/",
                element: <WorkspacePanel />,
                children: [
                    { index: true, element: <Index /> },
                    {
                        path: "workspaces",
                        children: [
                            { path: "new", element: <NewWorkspace /> },
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
            { path: "/login", element: <Login /> },
            { path: "/registration", element: <Registration /> },
        ],
    },
]);
