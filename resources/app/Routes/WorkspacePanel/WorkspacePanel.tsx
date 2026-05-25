import { Outlet } from "react-router";
import Sidebar from "../../Components/WorkspacePanel/Sidebar";
import TopBar from "../../Components/WorkspacePanel/TopBar";

const WorkspacePanel = () => {
    return (
        <div className="w-full h-screen flex">
            <Sidebar />
            <div className="w-full flex flex-col h-screen max-h-screen">
                <TopBar />
                <div className="flex-1">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default WorkspacePanel;
