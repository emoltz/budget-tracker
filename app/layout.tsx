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
import NavBar from "@/components/NavBar";
import {useState} from "react";

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

    return (
        <CacheProvider value={cache}>
            <ColorSchemeProvider
                colorScheme={colorScheme}
                toggleColorScheme={toggleColorScheme}

            >
                <MantineProvider
                    theme={{colorScheme}}
                    withGlobalStyles
                    withNormalizeCSS>
                    <html lang="en">
                    {/*TODO link ANTd style sheet cdn*/}
                    <AuthProvider>
                        <body>
                        <ChakraProvider>

                            <NavBar />
                                {children}

                            {/*</NavBar>*/}

                        </ChakraProvider>
                        </body>
                    </AuthProvider>
                    </html>
                </MantineProvider>
            </ColorSchemeProvider>
        </CacheProvider>


    )
}
