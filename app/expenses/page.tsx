"use client"
import {DataTable} from "./data-table"
import {columns} from "./columns";
import {IconArrowBigLeft, IconArrowBigRight} from "@tabler/icons-react";
// import {Button} from "@mantine/core";
import {Button} from "@/components/ui/button";
import {getExpenses_currentMonth} from "@/lib/firebase";
import {useAuth} from "@/app/context";
import {Expense} from "@/lib/Interfaces";
import React, {useEffect, useState} from 'react';
import LoginMantine from "@/components/LoginMantine";
import Loading from "@/app/loading";

export default function page() {

    const currentDateData = {
        month: "August",
        year: 2023,
    }
    const [currentExpenses, setCurrentExpenses] = useState<Expense[]>([]);
    const {user, loading} = useAuth();
    useEffect(() => {
        if (user) {
            getExpenses_currentMonth(user).then(expenses => {
                setCurrentExpenses(expenses)
                console.log(expenses)
            })
        }
    }, [user])

    if (loading) return <Loading/>
    if (!user) return <LoginMantine/>
    return (
        <>
            <div className={"pt-5 pl-5"}>
                <div className={"text-4xl font-bold pb-2"}>
                    {currentDateData.month} {currentDateData.year}
                </div>

                <div className={"flex flex-row justify-between"}>
                    <div className={"flex flex-row"}>
                        <div className={"text-2xl font-bold"}>
                            <Button variant={"outline"}>
                                <IconArrowBigLeft/>

                            </Button>

                        </div>
                        <div className={"text-2xl font-bold"}>
                            <Button variant={"outline"}>
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