import { ReactNode, useState, useEffect } from "react";

interface Props {
    children: ReactNode;
    duration?: number;
}

const FadeIn = ({ children, duration = 500 }: Props) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 50);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div
            style={{
                transitionDuration: `${duration}ms`,
            }}
            className={`transition-opacity flex-1 flex overflow-hidden ease-out ${isVisible ? "opacity-100" : "opacity-0"}`}
        >
            {children}
        </div>
    );
};

export default FadeIn;
