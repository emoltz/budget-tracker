"use client";

import {ColumnDef} from "@tanstack/react-table";
import {Expense} from "@/lib/Interfaces";
import {MoreHorizontal} from "lucide-react"
import {Button} from "@mantine/core";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

/*
Columns are where you define the core of what your table will look like. They define the data that will be displayed, how it will be formatted, sorted and filtered.
 */
export const columns: ColumnDef<Expense>[] = [
    {
        accessorKey: "name",
        header: () => {
            return <div className={"text-left font-bold"}>Name</div>;
        },
    },
    {
        accessorKey: "amount",
        header: () => {
            return <div className={"text-right"}>Amount</div>;
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
        accessorKey: "categoryID",
        header: "Category",
    },
    {
        accessorKey: "description",
        header: "Description",
    },
    {
        accessorKey: "actions",
        header: "Actions",
        id: "actions",
        cell: ({row}) => {
            // TODO hook this up to the actual data and customize options
            const expense: Expense = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(expense.id)}
                        >
                            Copy payment ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem>View customer</DropdownMenuItem>
                        <DropdownMenuItem>View payment details</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },

]