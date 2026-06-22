import { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {}

const LoginPageInput = ({ ...props }: Props) => {
    return (
        <input
            {...props}
            className="w-full outline-0 bg-[#101011] rounded-md text-lg py-1 px-2 placeholder:text-white/50 text-white"
        />
    );
};

export default LoginPageInput;
