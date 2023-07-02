"use client";
import {AuthProvider} from "@/app/context";
import {CacheProvider} from "@emotion/react";
import {
    useEmotionCache,
    MantineProvider,
    ColorSchemeProvider,
    ColorScheme,
    ActionIcon,
    useMantineColorScheme
} from "@mantine/core";
import {IconSun, IconMoonStars} from "@tabler/icons-react";
import {useServerInsertedHTML} from "next/navigation";
import {NextUIProvider} from "@nextui-org/react";
import {ChakraProvider} from "@chakra-ui/react";
import "./globals.css";
import NavBar from "@/components/NavBar";
import {useState} from "react";
import Footer from "@/components/Footer";

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
                    <head>
                        <meta charSet="utf-8"/>

                    </head>
                    <AuthProvider>
                        <body>
                        {/*<ChakraProvider>*/}
                        <div
                            className={"flex bg-gray-50"}
                        >
                            <NavBar/>
                            <main
                                // className={"flex-1 bg-white min-h-screen"}
                                className={"flex-1"}
                            >
                                {children}
                            </main>

                        </div>

                        <Footer links={footerLinks}/>
                        {/*</ChakraProvider>*/}
                        </body>
                    </AuthProvider>
                    </html>
                </MantineProvider>
            </ColorSchemeProvider>
        </CacheProvider>
    )
}
