import { ReactNode, useState, useEffect } from "react";

const FadeIn = ({ children }: { children: ReactNode }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 50);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div
            className={`transition-opacity duration-600 ease-out ${isVisible ? "opacity-100" : "opacity-0"}`}
        >
            {children}
        </div>
    );
};

export default FadeIn;
