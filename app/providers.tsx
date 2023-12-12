'use client';
import { createContext } from 'react';
import {CacheProvider} from "@emotion/react";
import { ColorScheme, ColorSchemeProvider, MantineProvider, EmotionCache} from '@mantine/core';

export const NavbarContext = createContext<boolean>(false);

interface ProviderProps {
    cache: EmotionCache;
    colorScheme: ColorScheme;
    toggleColorScheme: (value?: ColorScheme) => void;
    navbarCollapsed: boolean;
    children: React.ReactNode;

}
export function Providers({ cache, colorScheme, toggleColorScheme, navbarCollapsed, children } : ProviderProps) {
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
                    <NavbarContext.Provider value={navbarCollapsed}>

                        {children}
                    </NavbarContext.Provider>
                </MantineProvider>
            </ColorSchemeProvider>
        </CacheProvider>
    );
}