"use client";
import Image from 'next/image'
import styles from './page.module.css'
import RootLayout from "@/app/layout";
import {Button} from 'antd';

export default function Home() {

    return (
        <>
            <RootLayout>
                <Button
                    type={"primary"}
                >
                    Click me!
                </Button>

            </RootLayout>
        </>
    )
}
