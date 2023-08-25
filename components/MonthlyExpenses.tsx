"use client";
import {Expense} from "@/lib/Interfaces";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input"

import {IconPlus} from "@tabler/icons-react";
import {useState} from "react";

export default function MonthlyExpenses() {


    const monthlyExpensesSampleData: Expense[] = [
        {
            id: "1",
            amount: 1000,
            category_name: "Housing",
            name: "Rent",
            vendor: "Landlord",
            description: "Rent for the month of January",
            is_monthly: true,
            is_yearly: false,
        },
        {
            id: "2",
            amount: 50,
            category_name: "Utilities",
            name: "Electricity",
            vendor: "BC Hydro",
            description: "Electricity bill for the month of January",
            is_monthly: true,
            is_yearly: false,
        },
        {
            id: "3",
            amount: 50,
            category_name: "Utilities",
            name: "Internet",
            vendor: "Telus",
            description: "Internet bill for the month of January",
            is_monthly: true,
            is_yearly: false,
        }
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
        const newExpense = {
            id: Date.now().toString(),
            ...newExpenseRow,
            amount: parseFloat(newExpenseRow.amount),
            is_monthly: true,
            is_yearly: false
        };
        setMonthlyExpenses([...monthlyExpenses, newExpense]);
        toggleForm();
    }
    const handleInputChange = (e, field) => {
        setNewExpenseRow({
            ...newExpenseRow,
            [field]: e.target.value
        });
    }

    const toggleForm = () => {
        setShowForm(!showForm);
    }
    const handleSubmit = () => {
        setMonthlyExpenses([...monthlyExpenses, {...newExpense, id: Date.now().toString()}]);
        toggleForm();
    }
    return (
        <div className={"ml-20 mr-20"}>
            <Table className={""}>

                <TableHeader>
                    <TableRow>
                        <TableHead className=" text-left">Name</TableHead>
                        <TableHead className={"text-center"}>Category</TableHead>
                        <TableHead className={"text-center"}>Amount</TableHead>
                        <TableHead className={" text-center"}>Description</TableHead>
                        <TableHead className={" text-center"}>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        monthlyExpenses.map((expense, index) => {
                                return (
                                    <TableRow key={index}>
                                        <TableCell className={"text-left"}>{expense.name}</TableCell>
                                        <TableCell>{expense.category_name}</TableCell>
                                        <TableCell>${expense.amount.toFixed(2)}</TableCell>
                                        <TableCell>{expense.description}</TableCell>
                                        <TableCell>
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
                                <TableCell className={"w-[10px]"}>
                                    <Input placeholder="Description" value={newExpenseRow.description}
                                           onChange={(e) => handleInputChange(e, "description")}/>
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
            { !showForm &&

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