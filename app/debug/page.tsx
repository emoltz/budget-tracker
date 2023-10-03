"use client"
import IconPickerPopover from "@/components/IconPickerPopover";
import {useState} from "react";

export default function Debug() {
    const [selectedIcon, setSelectedIcon] = useState("home")
    return (
        <>
            <IconPickerPopover
                selectedIconName={selectedIcon}
                onIconSelect={setSelectedIcon}
                categoryName={"test"}

            />


        </>
    )
}

