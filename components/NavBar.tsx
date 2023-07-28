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
  // const {classes, cx} = useStyles();
//   const links = data.map((item) => (
//     <Link
//         className={cx(classes.link, {[classes.linkActive]: item.label === active})}
//         href={item.link}
//         key={item.label}
//         onClick={(event) => {

//             setActive(item.label);
//         }}
//     >
//         <item.icon className={classes.linkIcon} stroke={1.5}/>
//         {!collapsed && <span>{item.label}</span>}
//     </Link>
// ));

  return (
    <div className="flex flex-col my-4 mx-2 gap-2 divide-y">
      <div className="flex flex-row px-4 gap-2">
        {!collapsed && <Link href="/" 
          className={`text-2xl font-bold font-mono`}
        > Argonaut
        </Link> }
        <div
            className={`cursor-pointer`}
            onClick={() => {
                setCollapsed(!collapsed);
            }}
        >
            <IconArrowsExchange
                color={'black'}
            />
        </div>
      </div>
        
      <div className="flex flex-col gap-y-2 pt-3">
          {data.map((item) => (
              
              <div key={item.label}>
                  <NavItem
                    href={item.link}
                    key={item.label}
                    isActive={pathname.endsWith(item.link)}
                >
                  {/* .endsWith won't work for dynamic paths */}
                    <item.icon stroke={1.5}/>
                    {!collapsed && <span className="grow">{item.label}</span>}
                </NavItem>
              </div>
          ))}
      </div>
    </div>
  )
}