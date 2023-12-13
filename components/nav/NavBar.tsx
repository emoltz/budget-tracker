// noinspection JSIgnoredPromiseFromCall

"use client";

import {
    IconChartAreaLine,
    IconDashboard,
    IconFingerprint,
    IconLogout,
    IconMoneybag,
    IconReceipt2,
    IconSettings,
    IconPigMoney,
} from '@tabler/icons-react';
import {usePathname} from 'next/navigation'
import {auth} from "@/lib/firebase";
import NavItem from '@/components/nav/NavItem';
import {useMantineColorScheme} from "@mantine/core";

const data = [
    {link: '/dashboard', label: 'Dashboard', icon: IconDashboard},
    {link: '/dashboard/analysis', label: 'Analysis', icon: IconChartAreaLine},
    {link: '/dashboard/expenses', label: 'Expenses', icon: IconReceipt2},
    {link: '/dashboard/budgets', label: 'Budgets', icon: IconMoneybag},
    {link: '/dashboard/goals', label: 'Goals', icon: IconPigMoney},
    {link: '/dashboard/settings', label: 'Settings', icon: IconSettings},
];

interface Props {
    collapsed: boolean;
}

export default function NavBar({collapsed}: Props) {
  const pathname = usePathname();
  const {colorScheme} = useMantineColorScheme();

  return (
    <aside className={`flex absolute md:relative h-full z-10 border-r 
            ${colorScheme == 'dark' ? "dark bg-slate-900" : "bg-white"}  
            ${collapsed ? "w-0 overflow-hidden sm:w-[4.5rem]" : "w-64"} transition-all`}>
        <nav className="flex flex-col m-3 gap-2 divide-y w-full">            
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

        <div className="flex flex-col gap-y-3 pt-3 mt-auto">
            <div>
                <NavItem
                    name="My Profile"
                    Icon={IconFingerprint}
                    href={"/dashboard/profile"}
                    isActive={pathname.endsWith("/profile")}
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
                    href={"/dashboard"}
                    isActive={false}
                    collapsed={collapsed}
                />
            </div>
        </div>
    </nav>
  </aside>
  )
}