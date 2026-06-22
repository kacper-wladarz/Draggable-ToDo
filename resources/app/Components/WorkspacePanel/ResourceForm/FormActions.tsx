import { ReactNode } from "react";

interface Props {
    children: ReactNode;
}

const FormActions = ({ children }: Props) => {
    return (
        <div className="flex justify-end items-center gap-x-2">{children}</div>
    );
};

export default FormActions;
