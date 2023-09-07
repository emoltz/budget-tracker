"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable
} from "@tanstack/react-table"
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle,} from "@/components/ui/sheet"


import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {Expense} from "@/lib/Interfaces";
import {Button, useMantineTheme} from "@mantine/core";
import {useState} from "react";
import LoadingRow from "@/components/loadingSkeletons/LoadingRow";

/*
    TODO
     [] make filterable
     [] make searchable
     [] make columns resizable
     [] make columns visible/invisible
     [] make rows selectable

 */

interface DataTableProps<Expense, TValue> {
    columns: ColumnDef<Expense, TValue>[]
    data: Expense[]
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function DataTable<TData, TValue>({
                                             columns,
                                             data,
                                         }: DataTableProps<Expense, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([])
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        // to customize pagination: https://tanstack.com/table/v8/docs/api/features/pagination
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
        },
    });

    const {colorScheme} = useMantineTheme();


    return (
        <>

            <div className="rounded-md border ">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <CellRow
                                    key={row.id}
                                    row={row} colorScheme={colorScheme}/>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    <LoadingRow/>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button

                    variant={"white"}
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button

                    variant={"white"}
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>
        </>

    )
}

interface CellProps {
    row: any // this should be the `row` variable extracted from `table` in the map function above
    colorScheme?: "dark" | "light"
}

const CellRow = ({row, colorScheme}: CellProps) => {
    const cScheme = colorScheme ? useMantineTheme().colorScheme : colorScheme;

    const [isSheetOpen, setIsSheetOpen] = useState(false);
    // row info
    const rowTitle = row.original.name;
    const rowDescription = row.original.description;
    const rowAmount = row.original.amount;
    const rowCategory = row.original.category;
    const rowDate = row.original.date;
    const rowId = row.original.id;

    return (
        <>
            <TableRow
                key={row.id}
                className={"cursor-pointer"}
                onClick={() => {
                    console.log("clicked row");
                    // 2. Toggle the sheet's open/close state
                    setIsSheetOpen(prevState => !prevState);
                }}
                data-state={row.getIsSelected() && "selected"}
            >
                {row.getVisibleCells().map((cell: any) => (
                    <TableCell key={cell.id}
                               className={`${cScheme == 'dark' ? "text-white" : ""}`}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                ))}
            </TableRow>
            <Sheet open={isSheetOpen}
                   onOpenChange={() => setIsSheetOpen(false)}> {/* 3. Control the sheet's visibility */}
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>
                            {/*    get name of item*/}
                            {rowTitle}
                        </SheetTitle>
                        <SheetDescription>
                            <div className="">
                                {rowDescription}
                                {rowCategory}
                                <div className="">
                                    ${(rowAmount)}
                                </div>
                                <div className="">
                                    {rowDate}
                                </div>

                            </div>
                        </SheetDescription>
                    </SheetHeader>
                    <div className="">
                        This is where more stuff can go
                    </div>
                    <div className={"mt-5 flex gap-1"}>
                        <Button
                            variant={"outline"}
                            compact
                        >
                            Duplicate
                        </Button>
                        <Button
                            variant={"outline"}
                            color={"red"}
                            compact
                        >
                            Delete
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>
        </>
    )
}