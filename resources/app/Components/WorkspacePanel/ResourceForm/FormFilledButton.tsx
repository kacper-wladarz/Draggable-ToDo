import { ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    text: string;
}

const FormFilledButton = ({ text, ...props }: Props) => {
    return (
        <button
            {...props}
            className="h-7 bg-orange-500 rounded-sm px-3 font-medium text-white/80 cursor-pointer disabled:cursor-default disabled:bg-orange-500/50 disabled:text-white/60 hover:bg-orange-600 transition-all duration-150"
        >
            {text}
        </button>
    );
};

export default FormFilledButton;
