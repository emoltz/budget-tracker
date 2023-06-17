"use client";
import RootLayout from "@/app/layout";
import {Button} from "@mantine/core";
import {ActionIcon, useMantineColorScheme} from '@mantine/core';
import {IconSun, IconMoonStars} from '@tabler/icons-react';
import Link from "next/link";
import NavBar from "@/components/NavBar";

export default function Home() {
    return (
        <>
            <Button>Hello</Button>
            <div>

                <Button
                    variant={"light"}
                >
                    <Link href="/login">Login</Link>
                </Button>


            </div>
        </>
    )
}
