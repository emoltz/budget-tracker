'use client';
// import Image from 'next/image'
// import styles from './page.module.css'
import RootLayout from "@/app/layout";
import {Text} from "@nextui-org/react";

export default function Home() {
    return (
        <>
            <RootLayout>
                <Text
                    h2
                    size={30}
                    css={{
                        textGradient: "45deg, $blue600 -20%, $pink600 50%",
                    }}
                > Hello world!</Text>
            </RootLayout>
        </>
    )
}
