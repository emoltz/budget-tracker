"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Expense } from "@/lib/Interfaces";
import { ArrowUpDown } from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link";
import { Button } from "@/components/ui/button";


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
        header: ({ column }) => {
            return (
                <div className={"text-right"}>
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        <ArrowUpDown className="ml-2 h-4 w-4 " />
                        <div className="pr-1" />
                        Amount

                    </Button>
                </div>
            )
        },
        cell: ({ row }) => {
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
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Category
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "date",
        header: "Date",
    },
    {
        accessorKey: "actions",
        header: "Actions",
        id: "actions",
        cell: ({ row }) => {
            const expense: Expense = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant={"ghost"}
                        >
                            ...
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(expense.id)}
                        >
                            Copy Expense ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="cursor-pointer"
                        >
                            <Link href={`/expenses/${expense.id}`}>
                                Edit
                            </Link>

                        </DropdownMenuItem>

                        <DropdownMenuItem>
                            <button
                                className={"text-red-600 font-bold cursor-pointer"}
                                onClick={() => {
                                    console.log("Delete")
                                }}

                            >

                                Delete
                            </button>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },

]