import { FormHTMLAttributes, ReactNode } from "react";
import FormActions from "./FormActions";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";
import FormFilledButton from "./FormFilledButton";
import FormBorderButton from "./FormBorderButton";
import FormHeader from "./FormHeader";

interface Props extends FormHTMLAttributes<HTMLFormElement> {
    children: ReactNode;
}

const FormRoot = ({ children, ...props }: Props) => {
    return (
        <form
            className={`p-10 flex flex-col gap-y-6 flex-1 ${props.className}`}
            {...props}
        >
            {children}
        </form>
    );
};

const Form = Object.assign(FormRoot, {
    Header: FormHeader,
    Actions: FormActions,
    BorderButton: FormBorderButton,
    FilledButton: FormFilledButton,
    Input: FormInput,
    Select: FormSelect,
});

export default Form;
