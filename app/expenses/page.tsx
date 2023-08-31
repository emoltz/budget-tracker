"use client"
import {DataTable} from "./data-table"
import {columns} from "./columns";
import {IconArrowBigLeft, IconArrowBigRight} from "@tabler/icons-react";
import {Button, Tabs, useMantineTheme} from "@mantine/core";
// import {Button} from "@/components/ui/button";
import {getExpenses} from "@/lib/firebase";
import {useAuth} from "@/app/context";
import {DateData, Expense} from "@/lib/Interfaces";
import React, {useEffect, useState} from 'react';
import LoginMantine from "@/components/LoginMantine";
import LoadingTable from "@/app/expenses/LoadingTable";
import MonthlyExpenses from "@/components/MonthlyExpenses";
import AddButton from "@/components/ui/addButton";

export default function Page() {

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
    if (loading) return <LoadingTable/>
    if (!user) return <LoginMantine/>
    return (
        <div className={"m-5"}>
            <div className={`text-4xl font-bold pb-2 mt-5 ${colorScheme == 'dark' ? "text-white" : ""}`}>
                {dateData.monthName} {dateData.year}
            </div>
            <div className={"flex flex-row justify-between mb-10 mt-1"}>
                <div className={"flex flex-row gap-1"}>
                    <div className={"text-2xl font-bold"}>
                        <Button
                            variant={"outline"}
                        >
                            <IconArrowBigLeft/>

                        </Button>

                    </div>
                    <div className={"text-2xl font-bold"}>
                        <Button
                            variant={"outline"}
                        >
                            <IconArrowBigRight/>
                            {/*    TODO this should change the month back and forth*/}
                        </Button>
                    </div>
                </div>
            </div>

            <Tabs defaultValue={"expenses"}
                  variant={"outline"}
                  radius={"lg"}
            >
                <Tabs.List>
                    <Tabs.Tab value={"expenses"}>All Expenses</Tabs.Tab>
                    <Tabs.Tab value={"monthly"}>Monthly</Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value={"expenses"} pt={"xs"}>

                    <div className="flex justify-between">

                        <div className={"text-2xl font-medium m-2 "}>
                            All Expenses
                        </div>
                        <AddButton
                            onClick={() => {
                                console.log("clicked")
                            }}
                        />

                    </div>


                    <div className={""}>
                        <DataTable columns={columns} data={currentExpenses}/>
                    </div>
                </Tabs.Panel>
                <Tabs.Panel value={"monthly"} pt={"xs"}>
                    <MonthlyExpenses/>
                </Tabs.Panel>
            </Tabs>


        </div>
    )
}