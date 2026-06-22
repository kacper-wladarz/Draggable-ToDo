import { Link } from "react-router";
import Animations from "../../Components/Animations";

const Index = () => {
    return (
        <Animations.FadeIn>
            <div className="p-10 flex flex-col justify-center items-center flex-1 gap-y-5">
                <h1 className="text-white/90 text-5xl font-medium text-center">
                    Welcome to Draggable ToDo
                </h1>
                <Link to={"/workspaces/new"} className="group">
                    <h2 className="text-2xl text-sky-200 font-light group-hover:text-sky-400 transition-[color] duration-300 text-center">
                        Create workspaces and manage your tasks
                    </h2>
                </Link>
            </div>
        </Animations.FadeIn>
    );
};

export default Index;
