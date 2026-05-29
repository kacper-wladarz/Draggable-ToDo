import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router";
import { Suspense } from "react";
import LoaderIcon from "./Assets/LoaderIcon";
import { AuthContextProvider } from "./Providers/Auth/AuthContext";
import { WorkspaceContextProvider } from "./Providers/Workspace/WorkspaceContext";
import { router } from "./Router/router";

const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: 0, refetchOnWindowFocus: false } },
});

const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <Suspense fallback={<LoaderIcon />}>
                <AuthContextProvider>
                    <WorkspaceContextProvider>
                        <RouterProvider router={router} />
                    </WorkspaceContextProvider>
                </AuthContextProvider>
            </Suspense>
        </QueryClientProvider>
    );
};

export default App;
