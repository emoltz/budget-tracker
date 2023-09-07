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
    IconMail,
    IconMedicalCross,
    IconMoneybag,
    IconPlus,
    IconTrain,
} from "@tabler/icons-react";
import React from "react";

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
        component: <IconMail/>,
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
    },
    {
        name: "plus",
        component: <IconPlus/>,
    }

]

