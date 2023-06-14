"use client";
import {AuthProvider} from "@/app/context";
import {CacheProvider} from "@emotion/react";
import {useEmotionCache, MantineProvider} from "@mantine/core";
import {useServerInsertedHTML} from "next/navigation";

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
                <AuthProvider>

                    <body>
                    {children}
                    </body>
                </AuthProvider>
                </html>
            </MantineProvider>
        </CacheProvider>


    )
}
