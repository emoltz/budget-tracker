// IconPickerPopover.tsx
import React from 'react';
import IconPicker from '@/components/IconPicker';
import {icons} from '@/lib/icons';
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover"

interface IconPickerPopoverProps {
    selectedIconName: string | undefined;
    onIconSelect: (iconId: string) => void;
    categoryName: string;
}

export default function IconPickerPopover({selectedIconName, onIconSelect, categoryName}: IconPickerPopoverProps) {
    const selectedIcon = icons.find(icon => icon.name === selectedIconName);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <button
                    className={"bg-gray-100 p-1 rounded-lg hover:bg-gray-200"}
                >
                    {selectedIcon?.component}

                </button>
            </PopoverTrigger>
            <PopoverContent>
                <IconPicker onSelect={onIconSelect} categoryName={categoryName}/>
            </PopoverContent>
        </Popover>


    );
}
