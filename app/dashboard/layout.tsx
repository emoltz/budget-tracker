"use client";
import {NavbarContext} from "../providers"; // why
import {useMantineTheme} from "@mantine/core";
import NavBar from "@/components/nav/NavBar";
import {useContext} from "react";

export default function Layout({ children }: 
    { children: React.ReactNode
}) {
    const {colorScheme} = useMantineTheme();
    const collapsed = useContext(NavbarContext);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const footerLinks = [
        {
            link: "link1",
            label: "GitHub"

        },
        {
            link: "link2",
            label: "About"
        }
    ]
    return (
        <>
            <div className={"flex relative overflow-hidden h-[calc(100%-3.5rem)]"}>
                <NavBar collapsed={collapsed}/>
                <main
                    className={`flex-1 overflow-y-auto ${colorScheme === 'dark' ? "bg-slate-900" : "bg-white"}`}
                >
                    {children}
                </main>
            </div>
    
        </>

    )
}
