import { ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    text: string;
}

const FormBorderButton = ({ text, ...props }: Props) => {
    return (
        <button
            {...props}
            className="h-7 border-2 border-orange-500 rounded-sm px-3 font-medium text-white/80 cursor-pointer disabled:cursor-default disabled:border-orange-500/50 disabled:text-white/60 hover:border-orange-600 transition-all duration-150"
        >
            {text}
        </button>
    );
};

export default FormBorderButton;
