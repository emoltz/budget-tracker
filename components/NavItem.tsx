"use client";
import Link from 'next/link';
import React from "react";
import {useMantineColorScheme} from "@mantine/core";

interface Props {
    name: string;
    Icon: React.ElementType;
    href: string;
    isActive?: boolean;
    collapsed: boolean;
    // children: React.ReactNode;
}

export default function NavItem({name, Icon, href, isActive, collapsed}: Props) {
    const {colorScheme} = useMantineColorScheme();
    const selectedLight = 'bg-slate-300';
    const selectedDark = 'bg-slate-700';
    return (
        <Link
            href={href}
            className={`flex flex-row py-2 px-3 gap-x-3 items-center rounded-md ${isActive && (colorScheme == 'dark'? selectedDark : selectedLight)}`}
        >
            <Icon
                stroke={1.5}
                color={"gray"}
            />
            {!collapsed && <span className={`text-sm grow ${colorScheme == 'dark' ? 'text-amber-50' : ""}`}>
          {name}
        </span>}
            {/*{children}*/}
        </Link>
    )
}