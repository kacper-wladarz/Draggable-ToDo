import { Link } from "react-router";
import { SquarePen } from "lucide-react";
import SidebarWorkspacesList from "./SidebarWorkspacesList";

const Sidebar = () => {
    return (
        <div className="w-1/5 min-w-64 bg-[#151516] border-r border-r-white/10 flex flex-col gap-y-10">
            <div className="px-4 pt-4">
                <span className="text-white font-medium text-3xl">
                    Draggable ToDo
                </span>
            </div>
            <Link
                to={"/workspaces/new"}
                className="flex items-center group gap-x-1 font-light text-white cursor-pointer px-4"
            >
                <SquarePen
                    size={18}
                    className="text-white/90 group-hover:text-white transition-[color] duration-200"
                />
                <span className="text-white/90 text-lg group-hover:translate-x-px group-hover:text-white transition-[translate,color] duration-200">
                    New workspace
                </span>
            </Link>
            <div className="flex flex-col gap-y-2 flex-1 overflow-hidden mb-4">
                <div className="text-white/50 flex items-center gap-x-1 font-medium text-lg px-4">
                    <p className="text-md">Workspaces</p>
                </div>
                <SidebarWorkspacesList />
            </div>
        </div>
    );
};

export default Sidebar;
