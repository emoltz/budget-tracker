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
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"



import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import { Expense } from "@/lib/Interfaces"
import { useMantineTheme } from "@mantine/core"
import { SetStateAction, useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import LoadingRow from "@/components/loadingSkeletons/LoadingRow"
import { Button } from "@/components/ui/button"

interface DataTableProps<Expense, TValue> {
    columns: ColumnDef<Expense, TValue>[]
    data: Expense[]
}

export function DataTable<TValue>({ columns, data, }: DataTableProps<Expense, TValue>) {
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

    const { colorScheme } = useMantineTheme()

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
                        {table.getRowModel().rows?.length > 0 ? (
                            table.getRowModel().rows.map((row) => (
                                <>
                                    <CellRow
                                        key={row.id}
                                        row={row}
                                        colorScheme={colorScheme} cell={undefined}
                                    />
                                </>
                            ))

                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    <LoadingRow />
                                </TableCell>
                            </TableRow>
                        )}

                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                {table.getRowModel().rows?.length === 0 && (
                                    <div className="text-gray-500 text-lg">
                                        No expenses found
                                    </div>
                                )}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    // variant={"white"}
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    // variant={"white"}
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
    row: Row<Expense>
    colorScheme?: "dark" | "light"
}

const CellRow = ({ row, colorScheme }: CellProps) => {

    const _colorScheme = colorScheme ? useMantineTheme().colorScheme : colorScheme

    return (
        <>

            <TableRow
                key={row.id}
                className={"cursor-pointer"}

                data-state={row.getIsSelected() && "selected"}
            >
                {row.getVisibleCells().map((cell: Cell<Expense, unknown>) => (
                    <>
                        <TableCell key={cell.id}
                            className={`${_colorScheme == 'dark' ? "text-white" : ""}`}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>


                    </>
                ))}

            </TableRow>
        </>
    )
}


interface CellProps {
    cell: any

}
function EditInformationDialog({ cell }: CellProps) {
    return (
        <>
            <div className={""}>
                <div className="">
                    Name
                    <Input
                        defaultValue={cell.row.original.name}
                    />
                    <Separator />
                </div>
                <div className="">
                    Amount
                    <Input />
                    <Separator />
                </div>
                <div className="">
                    Category
                    <Input />
                    <Separator />
                </div>
                <div className="">
                    Date
                    <Input />
                    <Separator />
                </div>
                <div className="">
                    Notes
                    <Input />
                    <Separator />
                </div>
            </div>
        </>
    )
}