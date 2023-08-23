// noinspection JSIgnoredPromiseFromCall

"use client";
import {useEffect, useState} from 'react';

import {
    IconArrowsExchange,
    IconChartAreaLine,
    IconDashboard,
    IconFingerprint,
    IconLogout,
    IconMoneybag,
    IconReceipt2,
    IconSettings,
} from '@tabler/icons-react';
import Link from 'next/link';
import {usePathname} from 'next/navigation'
import {auth} from "@/lib/firebase";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import NavItem from '@/components/NavItem';
import {useMantineColorScheme} from "@mantine/core";

const data = [
    {link: '/', label: 'Dashboard', icon: IconDashboard},
    {link: '/analysis', label: 'Analysis', icon: IconChartAreaLine},
    {link: '/expenses', label: 'Expenses', icon: IconReceipt2},
    {link: '/budgets', label: 'Budgets', icon: IconMoneybag},
    {link: '/settings', label: 'Settings', icon: IconSettings},
];

export default function NavBar() {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();
    const animationDuration = 100;
    const [animationCompleted, setAnimationCompleted] = useState(true);
    const {colorScheme} = useMantineColorScheme();

    useEffect(() => {
        setCollapsed(window.innerWidth < 640)
    }, [])

    useEffect(() => {
        setAnimationCompleted(false);
        const timer: NodeJS.Timeout = setTimeout(() => {
            setAnimationCompleted(true);
        }, animationDuration);
        return () => clearTimeout(timer);
    }, [animationDuration, collapsed])

    return (
        <div className={`${colorScheme == 'dark' ? "bg-slate-900" : ""}`}>

            <aside
                className={`flex relative ${colorScheme == 'dark' ? "dark" : ""}  top-0 z-10 border-r ${collapsed ? "w-[4.5rem]" : "w-72"} transition-all`}>
                <nav className="flex flex-col m-3 gap-2 divide-y w-full dark:bg-slate-900">
                    <div className="flex flex-row px-2 py-1 gap-3 items-center">
                        {animationCompleted && !collapsed &&
                            <Link href="/"
                                  className={`${colorScheme == 'dark'? "text-amber-50" : ""} text-2xl font-bold font-mono justify-self-start transition-all`}
                            >Argonaut
                            </Link>}

                        {animationCompleted && !collapsed &&
                            <Link href="/"
                                  className={`text-xs font-mono  rounded-sm p-1 ${colorScheme == 'dark'? "text-amber-50" : ""} justify-self-start transition-all`}
                            >v0.2
                            </Link>}

                        {animationCompleted && !collapsed &&
                            <ThemeSwitcher/>
                        }
                        <div
                            className={`cursor-pointer grow items-center `}
                            onClick={() => {
                                setCollapsed(!collapsed);
                                setAnimationCompleted(false);
                            }}
                        >
                            <IconArrowsExchange
                                color={`${colorScheme == 'dark' ? 'white' : 'gray'}`}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-y-3 pt-3">
                        {data.map((item) => (
                            <div key={item.label}>
                                <NavItem
                                    name={item.label}
                                    Icon={item.icon}
                                    href={item.link}
                                    key={item.label}
                                    isActive={pathname.endsWith(item.link)}
                                    collapsed={collapsed}
                                />
                                {/* TODO: .endsWith won't work for dynamic paths */}
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col grow-1 mt-auto gap-y-3 pt-3">
                        <div>
                            <NavItem
                                name="My Profile"
                                Icon={IconFingerprint}
                                href={"/profile"}
                                isActive={pathname.startsWith("/profile")}
                                collapsed={collapsed}
                            />
                        </div>

                        <div onClick={() => {
                            auth!.signOut();
                            console.log("logged out");
                        }}>
                            <NavItem
                                name="Logout"
                                Icon={IconLogout}
                                href={"/login"}
                                isActive={pathname.startsWith("/debug")}
                                collapsed={collapsed}
                            />
                        </div>

                    </div>
                </nav>
            </aside>
        </div>
    )
}