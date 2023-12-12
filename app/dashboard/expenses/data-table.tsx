"use client"

import {
    Cell,
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    Row,
    SortingState,
    useReactTable
} from "@tanstack/react-table"

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {Expense} from "@/lib/Interfaces"
import {Button, useMantineTheme} from "@mantine/core"
import {useState} from "react"
import LoadingRow from "@/components/loadingSkeletons/LoadingRow"

interface DataTableProps<Expense, TValue> {
    columns: ColumnDef<Expense, TValue>[]
    data: Expense[]
}

export function DataTable<TValue>({columns, data,}: DataTableProps<Expense, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([])
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
        },
    })

    const {colorScheme} = useMantineTheme()

    return (
        <>
            <div className="rounded-md border ">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <CellRow
                                    key={row.id}
                                    row={row}
                                    colorScheme={colorScheme}
                                />
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
    row: Row<Expense> // this should be the `row` variable extracted from `table` in the map function above
    colorScheme?: "dark" | "light"
}

const CellRow = ({row, colorScheme}: CellProps) => {
    const cScheme = colorScheme ? useMantineTheme().colorScheme : colorScheme

    return (
        <TableRow
            key={row.id}
            className={"cursor-pointer"}
            onClick={() => {
                console.log("clicked row")
            }}
            data-state={row.getIsSelected() && "selected"}
        >
            {row.getVisibleCells().map((cell: Cell<Expense, unknown>) => (
                <TableCell key={cell.id}
                           className={`${cScheme == 'dark' ? "text-white" : ""}`}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
            ))}
        </TableRow>
    )
}
