"use client";
import {Expense, ExpenseClass} from "@/lib/Interfaces";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input"

import {IconPlus} from "@tabler/icons-react";
import {ChangeEvent, useState} from "react";

interface MonthlyExpensesProps {
    width?: string;
    height?: string;
}

export default function MonthlyExpenses({width, height}: MonthlyExpensesProps = {width: "w-full", height: "h-full"}) {

    const monthlyExpensesSampleData: Expense[] = [
        {
            id: "1",
            name: "Groceries",
            amount: 100,
            vendor: "Supermart",
            description: "Monthly grocery expenses",
            category: "Food",
            categoryID: "food-1",
            date: "2023-08-01",
            month: 8,
            year: 2023,
            is_yearly: false,
            is_monthly: true,
        },
        {
            id: "2",
            name: "Rent",
            amount: 1200,
            vendor: "Property Management Inc.",
            description: "Monthly rent payment",
            category: "Housing",
            categoryID: "housing-1",
            date: "2023-08-05",
            month: 8,
            year: 2023,
            is_yearly: false,
            is_monthly: true,
        },
        {
            id: "3",
            name: "Internet",
            amount: 50,
            vendor: "ISP Co.",
            description: "Monthly internet bill",
            category: "Utilities",
            categoryID: "utilities-1",
            date: "2023-08-10",
            month: 8,
            year: 2023,
            is_yearly: false,
            is_monthly: true,
        },
    ]
    const [monthlyExpenses, setMonthlyExpenses] = useState<Expense[]>(monthlyExpensesSampleData);
    const [showForm, setShowForm] = useState<boolean>(false);
    const [newExpenseRow, setNewExpenseRow] = useState({
        name: "",
        category: "",
        amount: 0,
        description: ""
    });

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>, field: string) => {
        const value = field === 'amount' ? parseFloat(e.target.value) : e.target.value;
        setNewExpenseRow({
            ...newExpenseRow,
            [field]: value,
        });
    };

    const toggleForm = () => {
        setShowForm(!showForm);
    }

    const handleSubmit = () => {
        const _newExpense = new ExpenseClass(
            newExpenseRow.amount,
            newExpenseRow.category,
            newExpenseRow.name,
            "",
            newExpenseRow.description,
            true
        )

        const newExpense = _newExpense.toObject();
        setMonthlyExpenses([...monthlyExpenses, newExpense]);
        toggleForm();
    };
    return (
        <div className={`${width} ${height}`}>
            <div className={"flex justify-between items-center mb-5 mt-5"}>
                <div className={"flex-grow text-center"}>
                    <div className={"text-2xl font-medium"}>
                        Monthly Expenses
                    </div>
                </div>

                <div>
                    <Button
                        className={"mr-16"}
                        variant={"secondary"}
                        size={"sm"}
                        onClick={showForm ? toggleForm : toggleForm}
                    >
                        <IconPlus/>
                    </Button>
                </div>
            </div>
            <Table className={""}>

                <TableHeader>
                    <TableRow>
                        <TableHead className={"text-left"}>Name</TableHead>
                        <TableHead className={"text-center"}>Category</TableHead>
                        <TableHead className={"text-center"}>Amount</TableHead>
                        <TableHead className={" text-center"}>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        monthlyExpenses.map((expense, index) => {
                                return (
                                    <TableRow key={index}>
                                        <TableCell className={"w-[150px] text-left"}>{expense.name}</TableCell>
                                        <TableCell className={"w-[30px] text-center"}>{expense.category}</TableCell>
                                        <TableCell className={"text-center font-mono w-[15px]"}>
                                            ${expense.amount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                        </TableCell>

                                        <TableCell className={"text-center text-2xl w-[20px]"}>
                                            <button className={" pr-2 pl-2 pb-1"}>...</button>
                                        </TableCell>
                                    </TableRow>
                                )
                            }
                        )
                    }
                    {showForm &&

                        <TableRow>
                            <TableCell className={""}>
                                <Input
                                    placeholder={"Expense Name"}
                                    onChange={(e) => handleInputChange(e, "name")}
                                />
                            </TableCell>
                            <TableCell className={""}>
                                <Input
                                    placeholder={""}
                                    onChange={(e) => handleInputChange(e, "category")}
                                />
                            </TableCell>
                            <TableCell className={""}>
                                <Input
                                    placeholder={"$"}
                                    onChange={(e) => handleInputChange(e, "amount")}
                                />
                            </TableCell>
                            <TableCell className={"text-center "}>
                                <button
                                    className={"pr-2 pl-2 pb-1"}
                                    onClick={handleSubmit}
                                >
                                    <IconPlus/>
                                </button>
                            </TableCell>
                        </TableRow>
                    }
                    {/* TOTALS */}
                    <TableRow>
                        <TableCell className={"text-right font-mono"} colSpan={2}>
                            {/*Total:*/}
                        </TableCell>
                        <TableCell className={"text-center font-mono font-bold"}>
                            ${monthlyExpenses.reduce((total, expense) => total + expense.amount, 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}

                        </TableCell>
                    </TableRow>


                </TableBody>
            </Table>


        </div>
    )
}