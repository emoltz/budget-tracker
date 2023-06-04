"use client";
import Image from 'next/image'
import styles from './page.module.css'
import RootLayout from "@/app/layout";
import {Text} from "@nextui-org/react";
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
                <Text
                    css={{
                        color: '$blue800',
                        fontSize:'$sm',
                    }}
                >
                    Hello world!
                </Text>

            </RootLayout>
        </>
    )
}
