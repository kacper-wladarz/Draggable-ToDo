import { TriangleAlert } from "lucide-react";
import { ReactNode } from "react";

interface Props {
    message: string | ReactNode;
}

const ModalBodyWarning = ({ message }: Props) => {
    return (
        <div className="bg-950/70 border border-orange-800 rounded-md p-3 flex gap-x-3">
            <div className="flex items-center">
                <TriangleAlert className="text-orange-500" size={20} />
            </div>
            <p className="text-orange-300/50 font-medium">{message}</p>
        </div>
    );
};

export default ModalBodyWarning;
