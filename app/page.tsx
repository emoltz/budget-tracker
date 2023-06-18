"use client";
import RootLayout from "@/app/layout";
import BudgetByCategory from "@/components/BudgetByCategory";
import {Button} from "@mantine/core";
import Link from "next/link";

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
            <BudgetByCategory></BudgetByCategory>
            </div>
        </>
    )
}
