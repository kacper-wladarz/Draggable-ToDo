import { ChevronRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

interface Props<T> {
    options: T[];
    optionValue: (item: T) => string | number;
    optionText: (item: T) => string;
    option: T | null;
    onOptionChange: (item: T | null) => void;
    label?: string;
    placeholder?: string;
    errors?: string[];
    acceptNoValue?: boolean;
    noValueText?: string;
}

const FormSelect = <T,>({
    options,
    optionValue,
    optionText,
    option,
    onOptionChange,
    label,
    placeholder,
    errors,
    acceptNoValue = false,
    noValueText = "No value",
}: Props<T>) => {
    const [isSelectOpen, setIsSelectOpen] = useState<boolean>(false);
    const [focusedIndex, setFocusedIndex] = useState<number>(-1);

    const selectRef = useRef<HTMLDivElement | null>(null);
    const errorRef = useRef<string | null>(null);

    const placeholderValue = useMemo(() => {
        if (option === null) {
            if (acceptNoValue) return noValueText;
            return placeholder;
        }
        return optionText(option);
    }, [option, acceptNoValue, noValueText, placeholder]);

    const itemsList = useMemo(() => {
        const list: (T | null)[] = [...options];
        if (acceptNoValue) {
            list.unshift(null);
        }
        return list;
    }, [options, acceptNoValue]);

    const error = useMemo(() => {
        if (errors && errors[0]) errorRef.current = errors[0];
        return errorRef.current;
    }, [errors]);

    const isOpen = !!(errors && errors[0]);

    useEffect(() => {
        const handleClickOutsideSelect = (event: MouseEvent) => {
            if (
                selectRef.current &&
                !selectRef.current.contains(event.target as Node)
            ) {
                setIsSelectOpen(false);
            }
        };

        window.addEventListener("mousedown", handleClickOutsideSelect);

        return () => {
            window.removeEventListener("mousedown", handleClickOutsideSelect);
        };
    }, []);

    const handleOptionClick = (newItem: T | null) => {
        onOptionChange(newItem);
        setIsSelectOpen(false);
    };

    return (
        <div className="flex items-center gap-x-3">
            {label ? (
                <span className="text-white/40 font-medium">{label}:</span>
            ) : null}
            <div className="relative group">
                <div
                    ref={selectRef}
                    tabIndex={0}
                    className="relative flex justify-between items-center min-w-40 gap-x-1 cursor-pointer outline-none"
                    onClick={() => setIsSelectOpen((prev) => !prev)}
                    onKeyDown={(event) => {
                        if (!isSelectOpen) {
                            if (
                                event.key === "Enter" ||
                                event.key === " " ||
                                event.key === "ArrowDown"
                            ) {
                                event.preventDefault();
                                setIsSelectOpen(true);
                            }
                            return;
                        }

                        switch (event.key) {
                            case "ArrowDown":
                                event.preventDefault();
                                setFocusedIndex((prev) =>
                                    prev < itemsList.length - 1 ? prev + 1 : 0,
                                );
                                break;
                            case "ArrowUp":
                                event.preventDefault();
                                setFocusedIndex((prev) =>
                                    prev > 0 ? prev - 1 : itemsList.length - 1,
                                );
                                break;
                            case "Enter":
                            case " ":
                                event.preventDefault();
                                if (
                                    focusedIndex >= 0 &&
                                    focusedIndex < itemsList.length
                                ) {
                                    handleOptionClick(itemsList[focusedIndex]);
                                }
                                break;
                            case "Escape":
                                event.preventDefault();
                                setIsSelectOpen(false);
                                break;
                        }
                    }}
                >
                    <span
                        className={`text-white/40 font-medium ${option !== null ? "text-white/90" : ""}`}
                    >
                        {placeholderValue}
                    </span>
                    <ChevronRight
                        className={`text-white/40 transition-transform duration-400 ${isSelectOpen ? "rotate-90" : "rotate-0"}`}
                        size={18}
                    />
                    <div
                        className={`absolute auto_size top-full -left-px cursor-default min-w-full transition-[height,opacity] duration-400 overflow-hidden ${isSelectOpen ? "h-auto opacity-100" : "h-0 opacity-50"}`}
                        onClick={(event) => event.stopPropagation()}
                        onMouseLeave={() => setFocusedIndex(-1)}
                    >
                        <div className="pt-2 px-px pb-px">
                            <div
                                className={`flex flex-col bg-[#151516] rounded-md shadow-[0_0_5px_-3px_rgba(255,255,255,1)]`}
                            >
                                {acceptNoValue ? (
                                    <span
                                        className={`px-3 py-1 text-white/40 hover:text-white/90 transition-all duration-200 whitespace-nowrap cursor-pointer font-medium hover:bg-[#1f1f20] ${option === null ? "text-white/90" : ""}`}
                                        onClick={() => handleOptionClick(null)}
                                        onMouseEnter={() => setFocusedIndex(0)}
                                        key={`option-no-value`}
                                    >
                                        {noValueText}
                                    </span>
                                ) : null}
                                {options.map((item, index) => {
                                    const actualIndex = acceptNoValue
                                        ? index + 1
                                        : index;

                                    return (
                                        <span
                                            className={`px-3 py-1 text-white/40 hover:text-white/90 transition-all duration-100 whitespace-nowrap cursor-pointer font-medium hover:bg-[#1f1f20] ${option && optionValue(item) === optionValue(option) ? "text-white/90" : ""} ${focusedIndex === actualIndex ? "bg-[#1f1f20] text-white/90" : ""}`}
                                            onClick={() =>
                                                handleOptionClick(item)
                                            }
                                            onMouseEnter={() =>
                                                setFocusedIndex(actualIndex)
                                            }
                                            key={`option-${optionValue(item)}`}
                                        >
                                            {optionText(item)}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="absolute w-full h-0.5 bg-white/30"></div>
                <div
                    className={`auto_size absolute h-0.5 bg-orange-500 ${isSelectOpen || option !== null ? "w-full" : "w-0"} transition-[width] duration-400 group-focus-within:w-full`}
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

export default FormSelect;
