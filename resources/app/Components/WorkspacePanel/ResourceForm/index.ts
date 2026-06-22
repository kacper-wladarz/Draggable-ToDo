import FormActions from "./FormActions";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";
import FormHeader from "./FormHeader";
import FormButton from "./FormButton";
import FormRoot from "./FormRoot";

const Form = Object.assign(FormRoot, {
    Header: FormHeader,
    Actions: FormActions,
    Button: FormButton,
    Input: FormInput,
    Select: FormSelect,
});

export default Form;
