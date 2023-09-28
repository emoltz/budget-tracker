"use client";
import { IconMenu2 } from '@tabler/icons-react'
import Link from 'next/link';
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { useMantineColorScheme, Image } from "@mantine/core";
import { useAuth } from "@/app/context";

interface Props {
//   collapsed: boolean;
  onCollapse: () => void;
}

export default function Header({onCollapse}: Props) {
  const user = useAuth().user;
  const profileURL = user?.photoURL ? user.photoURL : "/default_profile_pic.webp"

  const {colorScheme} = useMantineColorScheme();

  return(
    <header className={`sticky self-start top-0 w-full flex flex-row px-6 py-3 gap-3 border-b items-center ${colorScheme == 'dark' ? "bg-slate-800 border-slate-600" : "bg-slate-100"} z-20`}>
        <div
            className={`cursor-pointer items-center`}
            onClick={onCollapse}
        >
            <IconMenu2
                color={`${colorScheme == 'dark' ? 'white' : 'gray'}`}
            />
        </div>
        <Link href="/" 
            className={`text-2xl font-bold font-mono justify-self-start transition-all ${colorScheme == 'dark'? "text-amber-50" : ""}`}
            >Argonaut
        </Link>
           
        <Link href="https://github.com/emoltz/budget-tracker" 
            className="text-xs font-mono bg-slate-200 rounded-sm p-1"
            >v0.2
        </Link>
        
        <div className="ml-auto">
            <ThemeSwitcher />
        </div>
        <Link href="/profile" className="justify-self-end">
            <Image 
                maw={35} 
                mx="auto" 
                radius="50%" 
                src={profileURL} 
                alt="Profile image" 
                imageProps={{referrerPolicy : "no-referrer"}}
                />
        </Link>  
    </header>
  )
  
}