"use client";
import {AuthProvider} from "@/app/context";
import {CacheProvider} from "@emotion/react";
import {useEmotionCache, MantineProvider, Pagination, Navbar} from "@mantine/core";
import {useServerInsertedHTML} from "next/navigation";
import {NextUIProvider} from "@nextui-org/react";
import {ChakraProvider} from "@chakra-ui/react";
import NavBar from "@/components/NavBar";

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


    return (
        <CacheProvider value={cache}>
            <MantineProvider
                withGlobalStyles
                withNormalizeCSS>
                <html lang="en">
                {/*TODO link ANTd style sheet cdn*/}
                <AuthProvider>
                    <body>
                    <ChakraProvider>

                        <NavBar>
                            {children}

                        </NavBar>

                    </ChakraProvider>
                    </body>
                </AuthProvider>
                </html>
            </MantineProvider>
        </CacheProvider>


    )
}
