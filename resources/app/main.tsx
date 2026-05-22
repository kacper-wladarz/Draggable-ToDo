import ReactDOM from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router";
import { AuthContextProvider } from "./Providers/Auth/AuthContext";
import Login from "./Routes/Login/Login";
import NewProject from "./Routes/ToDo/NewProject/NewProject";
import TodoPanel from "./Routes/ToDo/TodoPanel";
import Index from "./Routes/ToDo/Index";
import Registration from "./Routes/Registration/Registration";

const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: 0 } },
});

const router = createBrowserRouter([
    {
        path: "/",
        element: <TodoPanel />,
        children: [
            {
                index: true,
                element: <Index />,
            },
            {
                path: "/create-project",
                element: <NewProject />,
            },
        ],
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/registration",
        element: <Registration />,
    },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <QueryClientProvider client={queryClient}>
        <AuthContextProvider>
            <RouterProvider router={router} />
        </AuthContextProvider>
    </QueryClientProvider>,
);
