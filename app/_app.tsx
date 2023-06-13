"use client";
import type {AppProps} from 'next/app'
import React from 'react'
import {AuthProvider} from "@/app/context";
import {MantineProvider} from "@mantine/core";

import './globals.css'
import {Inter} from 'next/font/google'

const inter = Inter({subsets: ['latin']})

function MyApp({Component, pageProps}: AppProps) {
    return (
        <>
            <MantineProvider
                withGlobalStyles
                withNormalizeCSS
                theme={{
                    colorScheme:'light',
                }}
            >

            <AuthProvider>

                <div className={inter.className}>
                    <Component {...pageProps} />
                </div>
            </AuthProvider>
            </MantineProvider>
        </>
    )
}

export default MyApp
