"use client";

import {ColumnDef} from "@tanstack/react-table";
import {Expense} from "@/lib/Interfaces";
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

]