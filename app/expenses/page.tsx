"use client"
import { IconArrowBigLeft, IconArrowBigRight } from "@tabler/icons-react";
import { Button, Tabs, useMantineTheme } from "@mantine/core";
import { useExpenses } from "@/lib/firebase";
import { useAuth } from "@/app/context";
import { DateData, Expense } from "@/lib/Interfaces";
import React from 'react';
import LoginMantine from "@/components/LoginMantine";
import LoadingTable from "@/app/expenses/LoadingTable";
import MonthlyExpenses from "@/components/MonthlyExpenses";
import AddExpensePopover from "@/components/AddExpensePopover";
import { getCurrentDate } from "@/lib/utils";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Timestamp, FieldValue } from "firebase/firestore";


export default function Page() {

    const dateData: DateData = getCurrentDate();
    const [currentDate, setCurrentDate] = React.useState<DateData>(dateData);
    const changeDate = (date: DateData) => {
        setCurrentDate(date);
    }

    const { user, loading } = useAuth();

    const { colorScheme } = useMantineTheme();
    if (loading) return <LoadingTable />
    if (!user) return <LoginMantine />
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
                                        monthName: date.toLocaleString('default', { month: 'long' }),
                                        month: newMonth,
                                        year: newYear
                                    };
                                    changeDate(newData);

                                }
                            }
                        >
                            <IconArrowBigLeft />

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
                                    monthName: date.toLocaleString('default', { month: 'long' }),
                                    month: newMonth,
                                    year: newYear
                                };
                                changeDate(newData);
                            }
                            }
                        >
                            <IconArrowBigRight />
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

                            <AddExpensePopover />
                        </div>

                    </div>


                    <div className={""}>
                        <ExpensesTable
                        />
                    </div>
                </Tabs.Panel>
                {/* <Tabs.Panel value={"monthly"} pt={"xs"}>
                    <MonthlyExpenses/>
                </Tabs.Panel> */}
            </Tabs>


        </div>
    )
}

function ExpensesTable() {
    const { user, loading } = useAuth();
    const dateData: DateData = getCurrentDate();
    const expenses: Expense[] = useExpenses(user, false, dateData.month, dateData.year);

    const formatDate = (date: Date | Timestamp | FieldValue | (() => FieldValue)) => {
        if (date instanceof Date) {
            return date.toLocaleDateString();
        }
        return ''
    };

    const formatCurrency = (amount: number) => {
        return `$${amount.toFixed(2)}`
    };

    if (loading) {
        return <LoadingTable />
    }
    return (
        <>
          <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {expenses.map((expense) => (
                    <TableRow key={expense.id}>
                        <TableCell className="font-medium">{expense.name}</TableCell>
                        <TableCell>{expense.categoryID}</TableCell>
                        <TableCell>{formatDate(expense.date)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(expense.amount)}</TableCell>
                        <TableCell className="text-center">...</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>

        </>
    )
}