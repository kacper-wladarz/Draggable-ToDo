import { type ComponentType, Suspense } from "react";
import LoaderIcon from "../Assets/LoaderIcon";

const Loadable = <P extends object>(Component: ComponentType) => {
    return (props: P) => (
        <Suspense fallback={<LoaderIcon />}>
            <Component {...props} />
        </Suspense>
    );
};

export default Loadable;
