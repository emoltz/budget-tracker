import {Expense} from "@/lib/Interfaces";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {Button} from "@/components/ui/button";

import {IconPlus} from "@tabler/icons-react";

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

    return (
        <div>
            <Table>

                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px] text-left">Name</TableHead>
                        <TableHead className={"text-center"}>Category</TableHead>
                        <TableHead className={"text-center w-[100px]"}>Amount</TableHead>
                        <TableHead className={"w-[200px] text-center"}>Description</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        monthlyExpensesSampleData.map((expense, index) => {
                                return (
                                    <TableRow key={index}>
                                        <TableCell className={"text-left"}>{expense.name}</TableCell>
                                        <TableCell>{expense.category_name}</TableCell>
                                        <TableCell>${expense.amount.toFixed(2)}</TableCell>
                                        <TableCell>{expense.description}</TableCell>
                                    </TableRow>
                                )
                            }
                        )
                    }

                </TableBody>
            </Table>
            <div className={"text-right pt-5"}>
                <Button
                    variant={"outline"}
                >

                    <IconPlus/>

                </Button>
            </div>

        </div>
    )
}