import { X } from "lucide-react";
import { ReactNode } from "react";
import { useModalContext } from "./ModalRoot";

interface Props {
    title: string;
    icon?: ReactNode;
}

const ModalHeader = ({ title, icon }: Props) => {
    const { close } = useModalContext();

    return (
        <div className="border-b border-orange-900 flex justify-between items-center p-6">
            <div className="flex items-center gap-x-3">
                <div className="p-1.25 bg-orange-900/40 rounded-lg border border-orange-800">
                    {icon}
                </div>
                <span className="font-medium text-orange-200 text-xl">
                    {title}
                </span>
            </div>
            <button
                className="p-0.5 rounded-lg bg-orange-950/0 hover:bg-orange-900/30 border border-orange-900 cursor-pointer transition-[background-color] duration-150"
                onClick={() => close()}
            >
                <X className="text-orange-600" size={20} />
            </button>
        </div>
    );
};

export default ModalHeader;
