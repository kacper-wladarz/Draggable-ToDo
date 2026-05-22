import { ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    text: string;
}

const LoginPageSubmitButton = ({ text, ...props }: Props) => {
    return (
        <button
            {...props}
            type="submit"
            className="bg-blue-500 rounded-md text-white text-lg cursor-pointer py-1 disabled:opacity-70 disabled:cursor-default font-medium"
        >
            {text}
        </button>
    );
};

export default LoginPageSubmitButton;
