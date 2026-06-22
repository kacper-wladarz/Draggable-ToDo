import ModalBody from "./ModalBody";
import ModalBodyWarning from "./ModalBodyWarning";
import ModalHeader from "./ModalHeader";
import ModalRoot from "./ModalRoot";

export default Object.assign(ModalRoot, {
    Header: ModalHeader,
    Body: Object.assign(ModalBody, {
        Warning: ModalBodyWarning,
    }),
});
