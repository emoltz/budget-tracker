"use client";
import RootLayout from "@/app/layout";
import {Button} from "@mantine/core";
import {Link} from "@nextui-org/react";

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
