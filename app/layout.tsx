"use client";
import "./globals.css";
import {AuthProvider} from "./context"
import {Providers} from "./providers"
import {useEffect, useState} from "react";

// import {CacheProvider} from "@emotion/react";
import {ColorScheme, useEmotionCache,} from "@mantine/core";
import {useServerInsertedHTML} from "next/navigation";

import Header from "@/components/nav/Header";
// import NavBar from "@/components/NavBar";
import Head from "next/head";
import {Toaster} from 'react-hot-toast';


export default function RootLayout({
            children,
        }: {
    children: React.ReactNode
}) {
    const cache = useEmotionCache();
    cache.compat = true;

    useServerInsertedHTML(() => (
        <style
            data-emotion={`${cache.key} ${Object.keys(cache.inserted).join(' ')}`}
            dangerouslySetInnerHTML={{
                __html: Object.values(cache.inserted).join(' '),
            }}
        />
    ));

    const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
    const toggleColorScheme = (value?: ColorScheme) =>
        setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

    
    const [collapsed, setCollapsed] = useState(false);

    // set collapsed to initially true if on mobile (or any small screen)
    useEffect(() => {
        setCollapsed(window.innerWidth < 640)
    }, [])

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
            <Providers
                cache={cache}
                colorScheme={colorScheme}
                toggleColorScheme={toggleColorScheme}
                navbarCollapsed={collapsed}
            >
                <html lang="en">
                    <Head>
                        <meta charSet="utf-8"/>
                    </Head>

                    <AuthProvider>
                        <body className={`h-[calc(100vh-0.1rem)] ${colorScheme == 'dark' ? "bg-slate-900" : ""} `}>
                            {/*<ChakraProvider>*/}
                            <Header
                                onCollapse={() => setCollapsed(!collapsed)}
                            />
                            <p>{collapsed}</p>
                                {children}
                                            {/*</ChakraProvider>*/}
                            <Toaster
                                position={"bottom-right"}
                            />
                        </body>
                    </AuthProvider>
                </html>
            </Providers>
        </>
    )
}
