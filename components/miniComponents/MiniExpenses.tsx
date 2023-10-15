"use client"
import {DataTable} from "@/app/expenses/data-table";
import React from "react";
import {DateData, Expense} from "@/lib/Interfaces";
import {useAuth} from "@/app/context";
import {useExpenses} from "@/lib/firebase";
import AddExpensePopover from "@/components/AddExpensePopover";
import {Button, rem} from "@mantine/core";
import ComponentFrameCenter from "@/components/layouts/ComponentFrameCenter";
import {ColumnDef} from "@tanstack/react-table";
import {ArrowUpDown} from "lucide-react";

const columns: ColumnDef<Expense>[] = [
    {
        accessorKey: "name",
        header: () => {
            return <div className={"text-left font-bold"}>Name</div>;
        },
    },
    {
        accessorKey: "amount",
        header: ({column}) => {
            return (
                <div className={"text-right"}>
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        <ArrowUpDown className="ml-2 h-4 w-4 "/>
                        <div className="pr-1"/>
                        Amount

                    </Button>
                </div>
            )
        },
        cell: ({row}) => {
            const amount = parseFloat(row.getValue("amount"));
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(amount);
            return <div className="text-right font-mono">{formatted}</div>

        }
    },
    {
        accessorKey: "category",
        header: ({column}) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Category
                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                </Button>
            )
        },
    },
    // {
    //     accessorKey: "actions",
    //     header: "Actions",
    //     id: "actions",
    //     cell: ({row}) => {
    //         const expense: Expense = row.original
    //
    //         return (
    //             <DropdownMenu>
    //                 <DropdownMenuTrigger asChild>
    //                     <Button variant="ghost" className="h-8 w-8 p-0">
    //                         <span className="sr-only">Open menu</span>
    //                         <MoreHorizontal className="h-4 w-4"/>
    //                     </Button>
    //                 </DropdownMenuTrigger>
    //                 <DropdownMenuContent align="end">
    //                     <DropdownMenuLabel>Actions</DropdownMenuLabel>
    //                     <DropdownMenuItem
    //                         onClick={() => navigator.clipboard.writeText(expense.id)}
    //                     >
    //                         Copy Expense ID
    //                     </DropdownMenuItem>
    //                     <DropdownMenuSeparator/>
    //                     <DropdownMenuItem>
    //                         <Link href={`/expenses/${expense.id}`}>
    //                             View Expense Details
    //                         </Link>
    //                     </DropdownMenuItem>
    //                     <DropdownMenuItem
    //                         onClick={() => console.log("View Category")}
    //                     >
    //                         View Category
    //                     </DropdownMenuItem>
    //                     <DropdownMenuItem>
    //                         <button
    //                             className={"text-red-600 font-bold cursor-pointer"}
    //                             onClick={() => {
    //                                 console.log("Delete")
    //                             }}
    //
    //                         >
    //
    //                             Delete
    //                         </button>
    //                     </DropdownMenuItem>
    //                 </DropdownMenuContent>
    //             </DropdownMenu>
    //         )
    //     },
    // },

]

export default function MiniExpenses() {
    const dateData: DateData = {
        month: 9,
        year: 2023,
        monthName: "September"
    }

    const {user, loading} = useAuth();
    // const {colorScheme} = useMantineTheme();
    const PRIMARY_COL_HEIGHT = rem(400);
    const expenses = useExpenses(user);
    if (loading) {
        return (
            <>
                Loading...
            </>
        )
    }
    return (
        <>
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
                <DataTable columns={columns} data={expenses}/>
            </ComponentFrameCenter>
        </>
    )
}