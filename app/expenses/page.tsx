"use client"
import {DataTable} from "./data-table"
import {columns} from "./columns";
import {IconArrowBigLeft, IconArrowBigRight} from "@tabler/icons-react";
// import {Button} from "@mantine/core";
import {Button} from "@/components/ui/button";
import {getExpenses} from "@/lib/firebase";
import {useAuth} from "@/app/context";
import {DateData, Expense} from "@/lib/Interfaces";
import React, {useEffect, useState} from 'react';
import LoginMantine from "@/components/LoginMantine";
import Loading from "@/app/loading";
import {useMantineTheme} from "@mantine/core";


export default function page() {

    const dateData: DateData = {
        month: 8,
        year: 2023,
        monthName: "August"
    }
    const [currentExpenses, setCurrentExpenses] = useState<Expense[]>([]);
    const {user, loading} = useAuth();
    useEffect(() => {
        if (user) {
            getExpenses(user, dateData.month, dateData.year).then(expenses => {
                setCurrentExpenses(expenses)

            })
        }
    }, [user])
    const {colorScheme} = useMantineTheme();
    if (loading) return <Loading/>
    if (!user) return <LoginMantine/>
    return (
        <>
            <div className={"pt-5 pl-5"}>
                <div className={`text-4xl font-bold pb-2 ${colorScheme == 'dark' ? "text-white" : ""}`}>
                    {dateData.monthName} {dateData.year}
                </div>

                <div className={"flex flex-row justify-between"}>
                    <div className={"flex flex-row gap-1"}>
                        <div className={"text-2xl font-bold"}>
                            <Button >
                                <IconArrowBigLeft/>

                            </Button>

                        </div>
                        <div className={"text-2xl font-bold"}>
                            <Button
                                // variant={"prim"}
                            >
                                <IconArrowBigRight/>
                                {/*    TODO this should change the month back and forth*/}
                            </Button>
                        </div>
                    </div>
                </div>

            </div>
            <div className="container mx-auto py-10">
                <DataTable columns={columns} data={currentExpenses}/>
            </div>


        </>
    )
}