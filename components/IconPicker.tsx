import {
    IconBellRinging,
    IconChartArea,
    IconChartPie2,
    IconChartPie3,
    IconDashboard,
    IconMagnet,
    IconMailAi,
    IconMoneybag,
    IconMoonStars,
} from "@tabler/icons-react";
import React from "react";
import {ActionIcon} from "@mantine/core";

const icons = [
    {
        id: 'dashboard', component: <IconDashboard/>,
    },
    {
        id: 'money', component: <IconMoneybag/>,
    },
    {
        id: 'moon', component: <IconMoonStars/>,
    },
    {
        id: 'chart', component: <IconChartArea/>,
    },
    {
        id: 'bell', component: <IconBellRinging/>,
    },
    {
        id: 'pie', component: <IconChartPie3/>,
    },
    {
        id: 'pie2', component: <IconChartPie2/>,
    },
    {
        id: 'magnet', component: <IconMagnet/>,
    },
    {
        id: 'mail', component: <IconMailAi/>,
    }
]

interface IconPickerProps {
    onSelect: (icon: React.JSX.Element) => void;
}

export default function IconPicker({onSelect}: IconPickerProps): React.JSX.Element {
    return (
        <div className={"grid grid-cols-4"}>
            {icons.map(icon => {
                return (
                    <ActionIcon
                        variant={""}
                        key={icon.id}
                        onClick={() => onSelect(icon.component)}
                    >
                        {icon.component}
                    </ActionIcon>
                )
            })}
        </div>
    )
}
