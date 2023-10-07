// IconPickerPopover.tsx
import React, {useState} from 'react';
import IconPicker from '@/components/IconPicker';
import {icons} from '@/lib/icons';
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover"

interface IconPickerPopoverProps {
    categoryName?: string;
    selectedIconName?: string | undefined;
    onIconSelect?: (iconId: string) => void;
    zIndex?: number;
}

export default function IconPickerPopover({selectedIconName, onIconSelect, categoryName, zIndex}: IconPickerPopoverProps) {
    const selectedIconFound = icons.find(icon => icon.name === selectedIconName);
    const [selectedIcon, setSelectedIcon] = useState("home")
    if (!zIndex){
        zIndex = 1;
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <button
                    style = {{
                        zIndex: zIndex
                    }}
                    className={"bg-gray-100 p-1 rounded-lg hover:bg-gray-200"}
                >
                    {selectedIconName ? selectedIconFound?.component : icons.find(icon => icon.name === selectedIcon)?.component}

                </button>
            </PopoverTrigger>
            <PopoverContent>
                <IconPicker onSelect={onIconSelect ? onIconSelect : setSelectedIcon} categoryName={categoryName ? categoryName : ""}/>
            </PopoverContent>
        </Popover>


    );
}
