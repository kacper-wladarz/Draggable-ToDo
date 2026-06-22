import { createContext, ReactNode, useContext, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface ModalContextInterface {
    isOpen: boolean;
    close: () => void;
}

const ModalContext = createContext<ModalContextInterface | undefined>(
    undefined,
);

export const useModalContext = () => {
    const context = useContext(ModalContext);

    if (!context) {
        throw new Error("Modal sub-components must be used within a ModalRoot");
    }

    return context;
};

interface Props {
    isOpen: boolean;
    close: () => void;
    children: ReactNode;
}

const ModalRoot = ({ isOpen, close, children }: Props) => {
    const modalRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutsideOfModal = (event: MouseEvent) => {
            if (
                modalRef.current &&
                !modalRef.current.contains(event.target as Node)
            ) {
                close();
            }
        };

        window.addEventListener("mousedown", handleClickOutsideOfModal);

        return () => {
            window.removeEventListener("mousedown", handleClickOutsideOfModal);
        };
    }, []);

    const modalContainer = document.getElementById("modal-container");
    if (!modalContainer)
        throw new Error("Can not display modal without modal-container div");

    return createPortal(
        <div
            className={`bg-black/40 backdrop-blur-sm fixed top-0 w-full h-screen flex justify-center items-center ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} transition-opacity duration-300`}
        >
            <ModalContext.Provider value={{ isOpen, close }}>
                <div
                    className="bg-orange-950/30 rounded-lg border border-orange-900 flex flex-col min-w-80 max-w-120"
                    ref={modalRef}
                >
                    {children}
                </div>
            </ModalContext.Provider>
        </div>,
        modalContainer,
    );
};

export default ModalRoot;
