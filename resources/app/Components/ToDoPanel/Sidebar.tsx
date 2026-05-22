import { Link } from "react-router";

const Sidebar = () => {
    return (
        <div className="w-1/5 min-w-50 bg-[#151516] border border-r-white/10 p-4">
            <button className="font-light text-white text-lg cursor-pointer">
                <Link to={"/create-project"}>Nowy projekt</Link>
            </button>
            <p className="text-white/50 text-sm">Projekty</p>
        </div>
    );
};

export default Sidebar;
