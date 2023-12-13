"use client";
import Link from 'next/link';
import {useMantineColorScheme} from "@mantine/core";

interface Props {
    name: string;
    Icon: React.ElementType;
    href: string;
    isActive?: boolean;
    collapsed: boolean;
}

export default function NavItem({name, Icon, href, isActive, collapsed}: Props) {
    const {colorScheme} = useMantineColorScheme();
    const selectedLight = 'bg-sky-300';
    const selectedDark = 'bg-sky-700';
    return (
        <Link
            href={href}
            className={`flex flex-row py-2 px-3 gap-x-3 items-center rounded-md 
                ${isActive && (colorScheme == 'dark'? selectedDark : selectedLight)} 
                ${colorScheme == 'dark' ? "hover:bg-slate-700" :"hover:bg-slate-300"}`}
        >
            <Icon
                stroke={1.5}
                color={"gray"}
            />
            {!collapsed && <span className={`text-sm grow ${colorScheme == 'dark' ? 'text-amber-50' : ""}`}>
            {name}
            </span>}
        </Link>
    )
}