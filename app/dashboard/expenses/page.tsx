"use client"
import {DataTable} from "./data-table"
import {columns} from "./columns";
import {IconArrowBigLeft, IconArrowBigRight} from "@tabler/icons-react";
import {Button, Tabs, useMantineTheme} from "@mantine/core";
import {useExpenses} from "@/lib/firebase";
import {useAuth} from "@/app/context";
import {DateData, Expense} from "@/lib/Interfaces";
import React from 'react';
import LoginMantine from "@/components/LoginMantine";
import LoadingTable from "@/app/dashboard/expenses/LoadingTable";
import MonthlyExpenses from "@/components/MonthlyExpenses";
import AddExpensePopover from "@/components/AddExpensePopover";
import {getCurrentDate} from "@/lib/utils";

export default function Page() {

    const dateData: DateData = getCurrentDate();
    const [currentDate, setCurrentDate] = React.useState<DateData>(dateData);
    const changeDate = (date: DateData) => {
        setCurrentDate(date);
    }

    const {user, loading} = useAuth();
    const expenses: Expense[] = useExpenses(user, false, currentDate.month, currentDate.year);

    const {colorScheme} = useMantineTheme();
    if (loading) return <LoadingTable/>
    if (!user) return <LoginMantine/>
    return (
        <div className={"m-5"}>
            <div className={`text-4xl font-bold pb-2 mt-5 ${colorScheme == 'dark' ? "text-white" : ""}`}>
                {currentDate.monthName} {currentDate.year}
            </div>
            <div className={"flex flex-row justify-between mb-10 mt-1"}>
                <div className={"flex flex-row gap-1"}>
                    <div className={"text-2xl font-bold"}>
                        <Button
                            variant={"outline"}
                            onClick={
                                () => {
                                    const newYear = currentDate.month === 1 ? currentDate.year - 1 : currentDate.year;
                                    const newMonth = currentDate.month === 1 ? 12 : currentDate.month - 1;
                                    const date = new Date(newYear, newMonth - 1); // month is 0-indexed in JavaScript Date
                                    const newData: DateData = {
                                        monthName: date.toLocaleString('default', {month: 'long'}),
                                        month: newMonth,
                                        year: newYear
                                    };
                                    changeDate(newData);

                                }
                            }
                        >
                            <IconArrowBigLeft/>

                        </Button>

                    </div>
                    <div className={"text-2xl font-bold"}>
                        <Button
                            variant={"outline"}
                            onClick={() => {
                                const newYear = currentDate.month === 12 ? currentDate.year + 1 : currentDate.year;
                                const newMonth = currentDate.month === 12 ? 1 : currentDate.month + 1;
                                const date = new Date(newYear, newMonth - 1); // month is 0-indexed in JavaScript Date
                                const newData: DateData = {
                                    monthName: date.toLocaleString('default', {month: 'long'}),
                                    month: newMonth,
                                    year: newYear
                                };
                                changeDate(newData);
                            }
                            }
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

                        <div className={`text-2xl font-medium m-2 ${colorScheme == "dark" ? "text-white" : ""}`}>
                            All Expenses
                        </div>
                        <div className="p-1">

                            <AddExpensePopover/>
                        </div>

                    </div>


                    <div className={""}>
                        <DataTable columns={columns} data={expenses}/>
                    </div>
                </Tabs.Panel>
                <Tabs.Panel value={"monthly"} pt={"xs"}>
                    <MonthlyExpenses/>
                </Tabs.Panel>
            </Tabs>


        </div>
    )
}