import { type ComponentType, Suspense } from "react";

const Loadable = <P extends object>(Component: ComponentType) => {
    return (props: P) => (
        <Suspense fallback={null}>
            <Component {...props} />
        </Suspense>
    );
};

export default Loadable;
