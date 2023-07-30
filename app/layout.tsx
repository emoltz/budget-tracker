"use client";
import {AuthProvider} from "./context"
import {CacheProvider} from "@emotion/react";
import {ColorScheme, ColorSchemeProvider, MantineProvider, useEmotionCache} from "@mantine/core";
import {useServerInsertedHTML} from "next/navigation";
import "./globals.css";
import NavBar from "@/components/NavBar";
import {useState} from "react";
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
                        <body>
                        {/*<ChakraProvider>*/}
                        <div
                            className={"flex bg-gray-50"}
                        >
                            <div className="flex">
                                <aside className="self-start sticky top-0">
                                    <NavBar/>
                                </aside>
                            </div>
                            <main
                                className={colorScheme === 'dark' ? "flex-1 bg-gray-900 min-h-screen" : "flex-1 bg-white min-h-screen"}
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
