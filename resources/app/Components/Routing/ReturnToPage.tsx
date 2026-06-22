import { Undo2 } from "lucide-react";
import { Link, LinkProps } from "react-router";

interface Props extends Pick<LinkProps, "className"> {
    url: string;
    text: string;
}

const ReturnToPage = ({ url, text, className = "" }: Props) => {
    return (
        <Link
            className={`text-white/40 flex items-center gap-x-1 font-medium cursor-pointer hover:text-white/60 transition-[color] duration-150 ${className}`}
            to={url}
        >
            <Undo2 />
            <span>{text}</span>
        </Link>
    );
};

export default ReturnToPage;
