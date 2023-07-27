"use client";

import {ColumnDef} from "@tanstack/react-table";
import {Expense} from "@/lib/Interfaces";
/*
Columns are where you define the core of what your table will look like. They define the data that will be displayed, how it will be formatted, sorted and filtered.
 */
export const columns: ColumnDef<Expense>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "amount",
        header: "Amount",
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