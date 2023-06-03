"use client";
import Image from 'next/image'
import styles from './page.module.css'
import RootLayout from "@/app/layout";
import {Container, Text} from "@nextui-org/react";

export default function Home() {
    return (
        <>
            <RootLayout>
                <div className={styles.container}>
                    <Text h1>
                        Hello world!
                    </Text>
                </div>
            </RootLayout>
        </>
    )
}
