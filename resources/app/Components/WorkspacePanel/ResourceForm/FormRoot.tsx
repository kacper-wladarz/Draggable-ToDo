import { FormHTMLAttributes, ReactNode } from "react";

interface Props extends FormHTMLAttributes<HTMLFormElement> {
    children: ReactNode;
}

const FormRoot = ({ children, ...props }: Props) => {
    return (
        <form
            {...props}
            className={`flex flex-col gap-y-6 flex-1 ${props.className || ""}`}
        >
            {children}
        </form>
    );
};

export default FormRoot;
