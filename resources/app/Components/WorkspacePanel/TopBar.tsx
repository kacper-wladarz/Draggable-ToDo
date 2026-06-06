import { useState } from "react";
import { useAuthContext } from "../../Providers/Auth/AuthContext";
import { useLogoutMutation } from "../../Tanstack/Auth/AuthMutations";
import { useNavigate } from "react-router";

const TopBar = () => {
    const { user, setToken } = useAuthContext();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const logoutMutation = useLogoutMutation();
    const navigate = useNavigate();

    const logout = async () => {
        await logoutMutation.mutateAsync().finally(() => {
            setToken(null);
            navigate("/login");
        });
    };

    return (
        <div className="w-full bg-[#151516] h-16 border-b border-b-white/10 flex items-center justify-end px-4 shrink-0">
            <div
                className="flex items-center gap-x-2 relative cursor-pointer"
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
            >
                {user && (
                    <>
                        <div className="w-9 h-9 bg-orange-500 rounded-full flex justify-center items-center text-lg text-white font-medium">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-white">{user?.name}</span>
                            <span className="text-white/50 text-sm font-light">
                                @{user.login}
                            </span>
                        </div>
                    </>
                )}
                <div
                    className={`auto_size absolute top-full w-full pt-1 ${isOpen ? "h-auto" : "h-0"} overflow-hidden transition-[height] duration-200`}
                >
                    <div className="bg-[#151516] rounded-sm border border-white/10 overflow-hidden">
                        <button
                            className="cursor-pointer hover:bg-[#1d1d1f] text-white/60 hover:text-white/90 px-2 py-1 w-full text-left transition-all duration-100 disabled:opacity-60"
                            onClick={logout}
                            disabled={logoutMutation.isPending}
                        >
                            Wyloguj
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopBar;
