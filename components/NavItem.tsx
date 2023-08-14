"use client";
import Link from 'next/link';

interface Props {
  name: string;
  Icon: React.ElementType;
  href: string;
  isActive?: boolean;
  collapsed: boolean;
  children: React.ReactNode;
}

export default function NavItem({name, Icon, href, isActive, collapsed, children}:Props) {
  return (
      <Link
        href={href}
        className={`flex flex-row py-2 px-3 gap-x-3 items-center rounded-md ${isActive && 'bg-slate-300' }`}
      >
        <Icon 
          stroke={1.5}
          color={"gray"}
        />
        {!collapsed && <span className="text-sm grow">{name}</span>}
        {children}
      </Link>
  )
}