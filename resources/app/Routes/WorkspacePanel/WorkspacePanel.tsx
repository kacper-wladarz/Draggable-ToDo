import { Outlet, useLocation, useParams } from "react-router";
import Sidebar from "../../Components/WorkspacePanel/Sidebar";
import TopBar from "../../Components/WorkspacePanel/TopBar";
import { Suspense, useEffect } from "react";
import LoaderIcon from "../../Assets/LoaderIcon";
import { useWorkspaceContext } from "../../Providers/Workspace/useWorkspaceContext";

const WorkspacePanel = () => {
    const { pathname } = useLocation();
    const { workspaceUuid } = useParams();
    const { setOpenedWorkspaceUuid } = useWorkspaceContext();

    useEffect(() => {
        if (workspaceUuid) {
            setOpenedWorkspaceUuid(workspaceUuid);
        }
    }, []);

    return (
        <div className="w-full h-screen flex">
            <Sidebar />
            <div className="w-full flex flex-col overflow-hidden">
                <TopBar />
                <div className="flex-1 flex overflow-hidden">
                    <Suspense fallback={<LoaderIcon />} key={pathname}>
                        <Outlet />
                    </Suspense>
                </div>
            </div>
        </div>
    );
};

export default WorkspacePanel;
