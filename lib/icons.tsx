import {
    IconArchive,
    IconBeach,
    IconBeerFilled,
    IconBellRinging,
    IconBooks,
    IconBox,
    IconChessKing,
    IconCircleKey,
    IconCurrencyCent,
    IconCurrencyDollar,
    IconDashboard,
    IconDog,
    IconHome,
    IconMailAi,
    IconMedicalCross,
    IconMoneybag,
    IconTrain,
} from "@tabler/icons-react";
import React from "react";


// interface IconProps {
//     size?: string | number;
//     stroke?: string | number;
//     color?: string;
// }

export type IconType = {
    name: string;
    component: React.JSX.Element;
}
export const icons: IconType[] = [
    {
        name: "dashboard",
        component: <IconDashboard/>,
    },
    {
        name: "bell",
        component: <IconBellRinging/>,
    },
    {
        name: "archive",
        component: <IconArchive/>,
    },
    {
        name: "beer",
        component: <IconBeerFilled/>,
    },
    {
        name: "books",
        component: <IconBooks/>,
    },
    {
        name: "chess",
        component: <IconChessKing/>,
    },
    {
        name: "key",
        component: <IconCircleKey/>,
    },
    {
        name: "cent",
        component: <IconCurrencyCent/>,
    },
    {
        name: "dollar",
        component: <IconCurrencyDollar/>,
    },
    {
        name: "mail",
        component: <IconMailAi/>,
    },
    {
        name: "money",
        component: <IconMoneybag/>,
    },
    {
        name: "beach",
        component: <IconBeach/>,
    },
    {
        name: "train",
        component: <IconTrain/>,
    },
    {
        name: "box",
        component: <IconBox/>,
    },
    {
        name: "dog",
        component: <IconDog/>,
    },
    {
        name: "home",
        component: <IconHome/>,
    },
    {
        name: "medical",
        component: <IconMedicalCross/>,
    }

]

