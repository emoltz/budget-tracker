"use client";
import {Expense} from "@/lib/Interfaces";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input"

import {IconPlus} from "@tabler/icons-react";
import {ChangeEvent, useState} from "react";

export default function MonthlyExpenses() {

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
        category_name: "",
        amount: "",
        description: ""
    });
    const addNewExpense = () => {
        const newExpense: Expense = {
            id: Date.now().toString(),
            name: newExpenseRow.name,
            amount: parseFloat(newExpenseRow.amount),
            vendor: "",  // provide a default value or make this field optional
            description: newExpenseRow.description,
            category: newExpenseRow.category_name,
            categoryID: "",  // provide a default value or make this field optional
            date: "",  // provide a default value or make this field optional
            month: 0,  // provide a default value or make this field optional
            year: 0,  // provide a default value or make this field optional
            is_yearly: false,
            is_monthly: true,
        };
        setMonthlyExpenses([...monthlyExpenses, newExpense]);
        toggleForm();
    };
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>, field: string) => {
        setNewExpenseRow({
            ...newExpenseRow,
            [field]: e.target.value
        });
    }

    const toggleForm = () => {
        setShowForm(!showForm);
    }
    const handleSubmit = () => {
        const newExpense: Expense = {
            id: Date.now().toString(),
            name: newExpenseRow.name,
            amount: parseFloat(newExpenseRow.amount),
            vendor: "",  // provide a default value or make this field optional
            description: newExpenseRow.description,
            category: newExpenseRow.category_name,
            categoryID: "",  // provide a default value or make this field optional
            date: "",  // provide a default value or make this field optional
            month: 0,  // provide a default value or make this field optional
            year: 0,  // provide a default value or make this field optional
            is_yearly: false,
            is_monthly: true,
        };
        setMonthlyExpenses([...monthlyExpenses, newExpense]);
        toggleForm();
    };
    return (
        <div className={""}>
            <Table className={""}>

                <TableHeader>
                    <TableRow>
                        <TableHead className=" text-left">Name</TableHead>
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
                                        <TableCell className={"text-left"}>{expense.name}</TableCell>
                                        <TableCell className={"text-center"}>{expense.category}</TableCell>
                                        <TableCell className={"text-center"}>${expense.amount.toFixed(2)}</TableCell>

                                        <TableCell className={"text-center"}>
                                            <Button variant={"outline"}>...</Button>
                                        </TableCell>
                                    </TableRow>
                                )
                            }
                        )
                    }
                    {
                        showForm && (
                            <TableRow>
                                <TableCell>
                                    <Input placeholder="Name" value={newExpenseRow.name}
                                           onChange={(e) => handleInputChange(e, "name")}/>
                                </TableCell>
                                <TableCell>
                                    <Input placeholder="Category" value={newExpenseRow.category_name}
                                           onChange={(e) => handleInputChange(e, "category_name")}/>
                                </TableCell>
                                <TableCell>
                                    <Input placeholder="Amount" value={newExpenseRow.amount}
                                           onChange={(e) => handleInputChange(e, "amount")}/>
                                </TableCell>

                                <TableCell>
                                    <Button onClick={addNewExpense}
                                            variant={"secondary"}
                                    >
                                        <IconPlus/>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )
                    }

                </TableBody>
            </Table>
            {!showForm &&

                <div className={"text-right pt-5"}>
                    <Button
                        variant={"secondary"}
                        onClick={toggleForm}
                    >

                        <IconPlus/>

                    </Button>
                </div>
            }

        </div>
    )
}