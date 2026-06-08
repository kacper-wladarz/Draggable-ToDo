import { ButtonHTMLAttributes, ReactNode } from "react";

export enum ButtonAppearance {
    bordered = "bordered",
    filled = "filled",
}

export enum ButtonVariant {
    default = "default",
    delete = "delete",
}

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    text: string;
    icon?: ReactNode;
    appearance: ButtonAppearance;
    variant?: ButtonVariant;
}

const appearanceMap: Record<ButtonVariant, Record<ButtonAppearance, string>> = {
    [ButtonVariant.default]: {
        [ButtonAppearance.filled]:
            "bg-orange-500 disabled:bg-orange-500/50 hover:bg-orange-600",
        [ButtonAppearance.bordered]:
            "border-2 border-orange-500 disabled:border-orange-500/50 hover:border-orange-600 !text-orange-500 hover:!text-orange-600 disabled:!text-orange-500/50",
    },
    [ButtonVariant.delete]: {
        [ButtonAppearance.filled]:
            "bg-red-700 disabled:bg-red-700/50 hover:bg-red-800",
        [ButtonAppearance.bordered]:
            "border-2 border-red-700 disabled:border-red-700/50 hover:border-red-800 !text-red-700 hover:!text-red-800 disabled:!text-red-700/50",
    },
};

const FormButton = ({
    text,
    icon,
    appearance,
    variant = ButtonVariant.default,
    ...props
}: Props) => {
    return (
        <button
            {...props}
            className={`min-h-7 rounded-sm px-1 py-0.5 font-medium text-white/80 cursor-pointer disabled:cursor-default disabled:text-white/60 transition-all duration-150 flex items-center gap-x-1 disabled:pointer-events-none ${appearanceMap[variant][appearance]}`}
        >
            {icon}
            <span>{text}</span>
        </button>
    );
};

export default FormButton;
