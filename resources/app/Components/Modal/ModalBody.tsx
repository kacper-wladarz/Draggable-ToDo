import { ReactNode } from "react";

interface Props {
    children: ReactNode;
}

const ModalBody = ({ children }: Props) => {
    return <div className="p-6 flex flex-col gap-y-6">{children}</div>;
};

export default ModalBody;
