"use client";
import {IconMenu2, IconUserCircle} from '@tabler/icons-react'
import Link from 'next/link';
import ThemeSwitcher from "@/components/ThemeSwitcher";

interface Props {
  collapsed: boolean;
  onCollapse: () => void;
}

export default function Header({collapsed, onCollapse}: Props) {
  return(
    <header className="sticky self-start top-0 w-full flex flex-row px-6 py-3 gap-3 border-b items-center bg-slate-100 z-20">
        <div
            className={`cursor-pointer items-center`}
            onClick={onCollapse}
            // onClick={() => {
                // setCollapsed(!collapsed);
                // setAnimationCompleted(false);
            // }}
        >
            <IconMenu2
                color={'black'}
            />
        </div>
        <Link href="/" 
            className={`text-2xl font-bold font-mono justify-self-start transition-all`}
        >Argonaut
        </Link>
           
        <Link href="https://github.com/emoltz/budget-tracker" 
            className="text-xs font-mono bg-slate-200 rounded-sm p-1"
        >v0.2
        </Link>
        
        <div className="ml-auto">
          <ThemeSwitcher />
        </div>
        <div className="justify-self-end">
          <IconUserCircle />
        </div>  
    </header>
  )
  
}