import { ReactNode } from "react";

interface PropsWithTitle {
    title: string;
    children?: never;
}

interface PropsWithChildren {
    title?: never;
    children: ReactNode;
}

type Props = PropsWithTitle | PropsWithChildren;

const FormHeader = ({ title, children }: Props) => {
    return (
        <span className="text-white/70 font-medium text-3xl">
            {title ?? children}
        </span>
    );
};

export default FormHeader;
