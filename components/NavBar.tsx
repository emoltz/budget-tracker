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
import { usePathname } from 'next/navigation'
import {auth} from "@/lib/firebase";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import NavItem from '@/components/NavItem';

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
  let animationDuration = 500;
  const [animationCompleted, setAnimationCompleted] = useState(true);

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
    <div className={`flex ${collapsed?"w-20":"w-72"} transition-all`}>
      <aside className="self-start sticky top-0">
      <div className={`max-h-screen flex flex-col m-3 px-3 gap-2 border-r-2 divide-y`}>
        <div className="flex flex-row px-4 py-1 gap-3">
          {animationCompleted && !collapsed && <Link href="/" 
              className={`text-2xl font-bold font-mono transition-all`}
            >Argonaut
            </Link>}
            
          {animationCompleted && !collapsed && <Link href="/" className="font-bold font-mono bg-slate-200 rounded-sm content-center p-1">v0.2</Link>}

          <div
              className={`cursor-pointer`}
              onClick={() => {
                  setCollapsed(!collapsed);
                  setAnimationCompleted(false);
              }}
          >
              <IconArrowsExchange
                  color={'black'}
              />
          </div>
        </div>
          
        <div className="flex flex-col gap-y-3 pt-3 mb-auto">
            {data.map((item) => (
                
                <div key={item.label}>
                    <NavItem
                      name={item.label}
                      Icon={item.icon}
                      href={item.link}
                      key={item.label}
                      isActive={pathname.endsWith(item.link)}
                      collapsed={collapsed}
                  >
                    {/* .endsWith won't work for dynamic paths */}
                  </NavItem>
                </div>
            ))}
        </div>

        <div className="flex flex-col mt-auto gap-y-3 pt-3">
          <div>
            <NavItem
              name="My Profile"
              Icon={IconFingerprint}
              href={"/profile"}
              isActive={pathname.startsWith("/profile")}
              collapsed={collapsed}
            >
            </NavItem>
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
              >
            </NavItem>
          </div>
          
        </div>
      </div>
      </aside>
    </div>
  )
}