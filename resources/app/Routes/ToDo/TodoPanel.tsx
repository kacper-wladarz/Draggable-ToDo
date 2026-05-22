import { Outlet, useNavigate } from "react-router";
import { useAuthContext } from "../../Providers/Auth/AuthContext";
import { useEffect } from "react";
import Sidebar from "../../Components/ToDoPanel/Sidebar";
import TopBar from "../../Components/ToDoPanel/TopBar";

const TodoPanel = () => {
    const { isAuthenticated } = useAuthContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
        }
    }, [isAuthenticated, navigate]);

    if (!isAuthenticated) {
        return null;
    }

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

export default TodoPanel;
