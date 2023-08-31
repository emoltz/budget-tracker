"use client";
import {AuthProvider} from "./context"
import {CacheProvider} from "@emotion/react";
import {ColorScheme, ColorSchemeProvider, MantineProvider, useEmotionCache} from "@mantine/core";
import {useServerInsertedHTML} from "next/navigation";
import "./globals.css";
import Header from "@/components/Header";
import NavBar from "@/components/NavBar";
import {useState, useEffect} from "react";
import Head from "next/head";

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
        <CacheProvider value={cache}>
            <ColorSchemeProvider
                colorScheme={colorScheme}
                toggleColorScheme={toggleColorScheme}
            >
                <MantineProvider
                    theme={{colorScheme}}
                    withGlobalStyles
                    withNormalizeCSS
                >
                    <html lang="en">
                    <Head>
                        <meta charSet="utf-8"/>
                    </Head>
                    
                    <AuthProvider>
                        <body className={`h-[calc(100vh-0.1rem)] ${colorScheme == 'dark' ? "bg-slate-900" : ""} `}>
                        {/*<ChakraProvider>*/}
                            <Header 
                                collapsed={collapsed}
                                onCollapse={() => setCollapsed(!collapsed)}
                            />
                            <div className={"flex relative overflow-hidden h-[calc(100%-3.5rem)]"} >
                                <NavBar collapsed={collapsed}/>
                                <main
                                    className={`flex-1 overflow-y-auto ${colorScheme === 'dark' ? "bg-slate-900" : "bg-white"}`}
                                >
                                    {children}
                                </main>
                            {/*<Footer links={footerLinks}/>*/}

                            </div>

                        {/*</ChakraProvider>*/}
                        </body>
                    </AuthProvider>
                    </html>
                </MantineProvider>
            </ColorSchemeProvider>
        </CacheProvider>
    )
}
