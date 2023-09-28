// IconPickerPopover.tsx
import React from 'react';
import {createStyles, Popover, rem, ThemeIcon} from '@mantine/core';
import IconPicker from '@/components/IconPicker';
import {icons} from '@/lib/icons';

const ICON_SIZE = rem(60);

interface IconPickerPopoverProps {
    selectedIconName: string | undefined;
    onIconSelect: (iconId: string) => void;
    categoryName: string;
}
const useStyles = createStyles((theme) => ({
    card: {
        position: 'relative',
        overflow: 'visible',
        padding: theme.spacing.xl,
        paddingTop: `calc(${theme.spacing.xl} * 1.5 + ${ICON_SIZE} / 3)`,
    },

    icon: {
        position: 'absolute',
        top: `calc(-${ICON_SIZE} / 3)`,
        left: `calc(50% - ${ICON_SIZE} / 2)`,
    },

    title: {
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        lineHeight: 1,
    },
}));

export default function IconPickerPopover({selectedIconName, onIconSelect, categoryName}: IconPickerPopoverProps) {
    const selectedIcon = icons.find(icon => icon.name === selectedIconName);
    const {classes} = useStyles();

    return (
        <Popover width={200}
                 position={"right-start"}
                 withArrow
                 shadow={"lg"}>

            <Popover.Target>
                <ThemeIcon className={classes.icon}
                           size={ICON_SIZE}
                           radius={ICON_SIZE}
                           data-test={"theme-icon"}>
                    {selectedIcon?.component}
                </ThemeIcon>
            </Popover.Target>

            <Popover.Dropdown>
                <IconPicker onSelect={onIconSelect} categoryName={categoryName}/>
            </Popover.Dropdown>
        </Popover>
    );
}
