import { Outlet, useLocation } from "react-router";
import Sidebar from "../../Components/WorkspacePanel/Sidebar";
import TopBar from "../../Components/WorkspacePanel/TopBar";
import { Suspense } from "react";
import LoaderIcon from "../../Assets/LoaderIcon";

const WorkspacePanel = () => {
    const { pathname } = useLocation();

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
