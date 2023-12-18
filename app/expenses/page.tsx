"use client"
import { IconArrowBigLeft, IconArrowBigRight } from "@tabler/icons-react";
import { Button, Tabs, useMantineTheme } from "@mantine/core";
import { useExpenses } from "@/lib/firebase";
import { useAuth } from "@/app/context";
import { DateData, Expense } from "@/lib/Interfaces";
import React, { useState } from 'react';
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
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { CategoryPicker } from "@/components/CategoryPicker";


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
                    {/* <Tabs.Tab value={"monthly"}>Monthly</Tabs.Tab> */}
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
                            <EditableCell className="font-medium" value={expense.name} onValueChange={(newValue) => {/* update expense name */ }} />

                            <CategoryPicker className={"text-center align-middle"} value={expense.categoryID} onCategoryChange={(newValue) => {/* update expense category */ }} />


                            <EditableCell className={"text-center align-middle"} value={formatDate(expense.date)} date={true} onValueChange={(newValue) => {/* update expense date */ }} />
                            <EditableCell className="text-right" value={formatCurrency(expense.amount)} onValueChange={(newValue) => {/* update expense amount */ }} />
                            <TableCell className="text-center">...</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

        </>
    )
}
interface EditableCellProps {
    value: string;
    onValueChange: (value: string) => void;
    className?: string;
    date?: boolean;

}

function EditableCell({ value, onValueChange, className, date }: EditableCellProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [newValue, setNewValue] = useState(value);

    const handleDoubleClick = () => {
        setIsEditing(true);
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewValue(event.target.value);
    }

    const handleBlur = () => {
        setIsEditing(false);
        onValueChange(newValue);
    }
    if (date) {
        return (
            <TableCell
                className={className}
            >
                <DatePicker
                    currentDate={new Date(newValue)}
                    onDateChange={(date) => {
                        setNewValue(date.toISOString())
                    }}
                />
            </TableCell>
        )
    }

    if (isEditing) {
        return (
            <TableCell
                className={className}
            >
                <Input
                    type="text"
                    value={newValue}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
            </TableCell>
        );
    }

    return (
        <TableCell
            onDoubleClick={handleDoubleClick}
            className={className}>
            {value}
        </TableCell>
    );



}

interface DatePickerProps {
    currentDate: Date;
    onDateChange: (date: Date) => void;
}

function DatePicker({ currentDate, onDateChange }: DatePickerProps) {
    const [date, setDate] = useState<Date>()

    React.useEffect(() => {
        setDate(currentDate);
    }, [currentDate]);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    )

}