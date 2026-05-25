import { InputHTMLAttributes, useState } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    errors?: string[];
}

const FormInput = ({ label, errors, ...props }: Props) => {
    const [isInputActive, setIsInputActive] = useState<boolean>(false);

    return (
        <div className="flex items-center gap-x-3">
            {label ? (
                <span className="text-white/40 font-medium">{label}:</span>
            ) : null}
            <div className="relative">
                <input
                    {...props}
                    className="outline-none text-white/90 font-medium"
                    onFocus={() => setIsInputActive(true)}
                    onBlur={() => setIsInputActive(false)}
                />
                <div className="absolute w-full h-0.5 bg-white/30"></div>
                <div
                    className={`auto_size absolute h-0.5 bg-orange-500 ${isInputActive || props.value ? "w-full" : "w-0"} transition-[width] duration-700`}
                ></div>
            </div>
            <span
                className={`auto_size ${errors && errors[0] ? "h-auto" : "h-0"} transition-all duration-300 overflow-hidden text-red-600/80 font-medium`}
            >
                {(errors && errors[0]) || "\u00A0"}
            </span>
        </div>
    );
};

export default FormInput;
