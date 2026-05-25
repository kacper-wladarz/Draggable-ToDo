import { InputHTMLAttributes, useMemo, useRef, useState } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    errors?: string[];
}

const FormInput = ({ label, errors, ...props }: Props) => {
    const [isInputActive, setIsInputActive] = useState<boolean>(false);
    const errorRef = useRef<string | null>(null);
    const error = useMemo(() => {
        if (errors && errors[0]) errorRef.current = errors[0];
        return errorRef.current;
    }, [errors]);

    const isOpen = !!(errors && errors[0]);

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
                className={`auto_size ${error && isOpen ? "h-auto" : "h-0"} transition-all duration-150 overflow-hidden text-orange-500 font-medium`}
            >
                {error || "\u00A0"}
            </span>
        </div>
    );
};

export default FormInput;
