"use client"
import { useClickAway } from "@/hooks/use-click-away";
import { ReactNode } from "react";

interface DropdownProps {
    items: ReactNode[],
    label: ReactNode,
    additionalInfo?: ReactNode
    isLabelStyled: boolean,
    isPrimary: boolean,
    isAlignedEnd?: boolean,
}

const Dropdown = ({ items, label, additionalInfo, isLabelStyled, isPrimary, isAlignedEnd }: DropdownProps) => {

    const ref: any = useClickAway(() => {
        ref.current.removeAttribute("open");
    });

    return (
        <details ref={ref} className={`dropdown ${isAlignedEnd && "dropdown-end"}`} role="menu">
            <summary
                className={`${isLabelStyled ? `btn btn-sm ${isPrimary ? "btn-primary" : "btn-ghost"} m-1 normal-case rounded` : "list-none cursor-pointer"}`}>
                {label}
            </summary>
            <ul className={`p-2 shadow menu dropdown-content z-[1] backdrop-blur bg-base-200/50 rounded-box ${additionalInfo ? "w-fit" : ""}`}>
                {additionalInfo && additionalInfo}

                <div className="flex flex-col gap-2">
                    {items.map((item, i) => (
                        <li key={`dropdownItem${i}`} role="menuitem">{item}</li>
                    ))}
                </div>
            </ul>
        </details>
    )
}

export default Dropdown;