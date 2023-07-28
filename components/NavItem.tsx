"use client";
import Link from 'next/link';

interface Props {
  href: string;
  isActive?: boolean;
  children: React.ReactNode;
}

export default function NavItem({href, isActive, children}:Props) {
  return (
      <Link
        href={href}
        className={`flex flex-row p-2 gap-x-2 justify-evenly rounded-md ${isActive ? 'bg-sky-500 text-white' : 'bg-slate-50'}`}
      >
        {children}
      </Link>
  )
}