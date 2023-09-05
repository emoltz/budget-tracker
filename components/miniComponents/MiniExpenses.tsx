"use client"
import {DataTable} from "@/app/expenses/data-table";
import {columns} from "@/app/expenses/columns";
import React, {useEffect, useState} from "react";
import {DateData, Expense} from "@/lib/Interfaces";
import {useAuth} from "@/app/context";
import {getExpenses} from "@/lib/firebase";
import AddExpensePopover from "@/components/AddExpensePopover";
import {rem, useMantineTheme} from "@mantine/core";
import ComponentFrameCenter from "@/components/layouts/ComponentFrameCenter";

export default function MiniExpenses() {
    const dateData: DateData = {
        month: 9,
        year: 2023,
        monthName: "September"
    }
    const [currentExpenses, setCurrentExpenses] = useState<Expense[]>([]);
    const {user, loading} = useAuth();
    const {colorScheme} = useMantineTheme();
    const PRIMARY_COL_HEIGHT = rem(400);
    useEffect(() => {
        if (user) {
            getExpenses(user, dateData.month, dateData.year).then(expenses => {
                setCurrentExpenses(expenses)

            })
        }
    }, [user])
    if (loading) {
        return (
            <>
                Loading...
            </>
        )
    }
    return (
        <ComponentFrameCenter
            PRIMARY_COL_HEIGHT={PRIMARY_COL_HEIGHT}
            // title={"All Expenses"}

        >

            <div className={"flex justify-between"}>
                <div className={"text-2xl"}>
                    All Expenses
                </div>
                <div className="p-1">

                    <AddExpensePopover/>
                </div>

            </div>
            <DataTable columns={columns} data={currentExpenses}/>
        </ComponentFrameCenter>
    )
}