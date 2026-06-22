import { useRouteError } from "react-router";
import Animations from "../../Components/Animations";
import { useMemo } from "react";

const WorkspaceErrorBoundary = () => {
    const error = useRouteError();

    const errorObject = useMemo(() => {
        if (error && typeof error === "object" && "status" in error) {
            switch (error.status) {
                case 404:
                    return {
                        code: 404,
                        message: "Workspace does not exist",
                    };
                default:
                    return {
                        code: 500,
                        message: "Internal server error",
                    };
            }
        }
    }, [error]);

    return (
        <Animations.FadeIn>
            <div className="flex-1 flex gap-y-4 flex-col justify-center items-center">
                <p className="text-white text-7xl">{errorObject?.code}</p>
                <p className="text-white/70 text-2xl font-light">
                    {errorObject?.message}
                </p>
            </div>
        </Animations.FadeIn>
    );
};

export default WorkspaceErrorBoundary;
