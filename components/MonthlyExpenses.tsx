"use client";
import {DateData, Expense, ExpenseClass} from "@/lib/Interfaces";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input"
import {CategoryPicker} from "@/components/CategoryPicker";
import {IconPlus} from "@tabler/icons-react";
import {ChangeEvent, MutableRefObject, useEffect, useRef, useState} from "react";
import {getExpenses, updateExpense} from "@/lib/firebase";
import {useAuth} from "@/app/context";
import {debounce} from "lodash"

interface MonthlyExpensesProps {
    width?: string;
    height?: string;
}

export default function MonthlyExpenses({width, height}: MonthlyExpensesProps = {width: "w-full", height: "h-full"}) {

    const initialExpenseRow = {
        name: "",
        category: "",
        amount: 0,
        description: ""
    };

    const [showForm, setShowForm] = useState<boolean>(false);
    const [newExpenseRow, setNewExpenseRow] = useState(initialExpenseRow);
    const {user, loading} = useAuth();
    const sampleDateData: DateData = {
        month: 8,
        year: 2023,
        monthName: "August"
    }

    const [currentExpenses, setCurrentExpenses] = useState<Expense[]>([]);
    useEffect(() => {
        if (user) {
            getExpenses(user, sampleDateData.month, sampleDateData.year, true).then(expenses => {
                setCurrentExpenses(expenses)
                console.log("Expenses: ", expenses)

            })
        }
    }, [user])

    // TODO replace with custom loading skeleton
    if (loading) return <div>Loading...</div>

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>, field: string) => {
        const value = field === 'amount' ? parseFloat(e.target.value) : e.target.value;
        setNewExpenseRow({
            ...newExpenseRow,
            [field]: value,
        });
    };

    const handleCategoryPickerChange = (newValue: string) => {
        setNewExpenseRow({
            ...newExpenseRow,
            category: newValue,
        });
    }

    const handleCellEdit = async (
        newValue: string | number,
        expenseIndex: number,
        field: keyof Expense
    ) => {
        const updatedExpenses = [...currentExpenses];
        let processedValue = newValue;

        if (field === "amount") {
            processedValue = parseFloat(String(newValue).replace(/,/g, ""));
        }

        if (typeof updatedExpenses[expenseIndex] !== "undefined") {

            updatedExpenses[expenseIndex] = {
                ...updatedExpenses[expenseIndex],
                [field]: processedValue,
            };

            await updateExpense(user, updatedExpenses[expenseIndex]).then(() => {
                console.log("Expense updated: ", updatedExpenses[expenseIndex])
            });

        }

        setCurrentExpenses(updatedExpenses);
    };


    const toggleForm = () => {
        setShowForm(!showForm);
    }


    const handleSubmit = async () => {
        const _newExpense = new ExpenseClass(
            newExpenseRow.amount,
            newExpenseRow.category,
            newExpenseRow.name,
            "",
            newExpenseRow.description,
            true
        )

        const newExpense = _newExpense.toObject();
        await updateExpense(user, newExpense)


        setCurrentExpenses([...currentExpenses, newExpense]);
        toggleForm();

        // reset form fields
        setNewExpenseRow(initialExpenseRow);
    };

    return (
        <div className={`${width} ${height}`}>
            <div className={"flex justify-between items-center mb-5 mt-5"}>
                <div className={"flex-grow "}>
                    <div className={"text-2xl font-medium"}>
                        Monthly Expenses
                    </div>
                </div>

                <div>
                    <Button
                        className={"mr-16"}
                        variant={"secondary"}
                        size={"sm"}
                        onClick={showForm ? toggleForm : toggleForm}
                    >
                        <IconPlus/>
                    </Button>
                </div>
            </div>
            <Table className={""}>

                <TableHeader>
                    <TableRow>
                        <TableHead className={"text-left"}>Name</TableHead>
                        <TableHead className={"text-center"}>Category</TableHead>
                        <TableHead className={"text-center"}>Amount</TableHead>
                        <TableHead className={" text-center"}>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        currentExpenses.map((expense, index) => {
                                return (
                                    <TableRow key={index}>
                                        <EditableTableCell
                                            className={"w-[150px] text-left"}
                                            initialValue={expense.name}
                                            onEdit={(newValue) => handleCellEdit(newValue, index, "name")}
                                            type={"text"}
                                        />

                                        <EditableTableCell
                                            className={"w-[30px] text-center"}
                                            initialValue={expense.category}
                                            onEdit={(newValue) => handleCellEdit(newValue, index, "category")}
                                            type={"category"}
                                        />
                                        <EditableTableCell
                                            className={"text-center font-mono w-[15px]"}
                                            initialValue={`${expense.amount}`}
                                            onEdit={(newValue) => handleCellEdit(newValue, index, "amount")}
                                            isCurrency
                                        />


                                        <TableCell className={"text-center text-2xl w-[20px]"}>
                                            <button className={" pr-2 pl-2 pb-1"}>...</button>
                                        </TableCell>
                                    </TableRow>
                                )
                            }
                        )
                    }
                    {showForm &&

                        <TableRow>
                            <TableCell className={""}>
                                <Input
                                    placeholder={"Expense Name"}
                                    onChange={(e) => handleInputChange(e, "name")}
                                />
                            </TableCell>
                            <TableCell className={""}>
                                <CategoryPicker
                                    onCategoryChange={handleCategoryPickerChange}
                                    value={newExpenseRow.category}
                                />

                                {/*<Input*/}
                                {/*    placeholder={""}*/}
                                {/*    onChange={(e) => handleInputChange(e, "category")}*/}
                                {/*/>*/}
                            </TableCell>
                            <TableCell className={""}>
                                <Input
                                    placeholder={"$"}
                                    onChange={(e) => handleInputChange(e, "amount")}
                                />
                            </TableCell>
                            <TableCell className={"text-center "}>
                                <button
                                    className={"pr-2 pl-2 pb-1"}
                                    onClick={handleSubmit}
                                >
                                    <IconPlus/>
                                </button>
                            </TableCell>
                        </TableRow>
                    }
                    {/* TOTALS */}
                    <TableRow>
                        <TableCell className={"text-right font-mono"} colSpan={2}>
                            {/*Total:*/}
                        </TableCell>
                        <TableCell className={"text-center font-mono font-bold"}>
                            {/*TODO put this in summary document...? */}
                            ${currentExpenses.reduce((total, expense) => total + expense.amount, 0).toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}

                        </TableCell>
                    </TableRow>


                </TableBody>
            </Table>


        </div>
    )
}


interface EditableTableCellProps {
    initialValue: string | number;
    onEdit: (newValue: string | number) => void;
    isCurrency?: boolean;
    className?: string;
    type?: "text" | "category" | "amount";
}

const EditableTableCell = ({initialValue, onEdit, isCurrency, className, type}: EditableTableCellProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState<string | number>(initialValue);
    const inputRef: MutableRefObject<HTMLInputElement | null> = useRef(null);

    const handleClickOutside = (event: MouseEvent) => {
        if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
            handleEdit();
        }
    };

    useEffect(() => {
        if (isEditing) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [isEditing])


    const handleEdit = () => {
        onEdit(value);
        setIsEditing(false);
    }

    const debounceOnEdit = debounce(onEdit, 4000);
    useEffect(() => {
        if (!isEditing) {
            debounceOnEdit(value);
        }
    }, [isEditing])

    const handleCellClick = () => {
        if (!isEditing) {
            setIsEditing(true);
        }
    };
    return (
        <TableCell
            className={`${className}`}
            style={{cursor: isEditing ? 'text' : 'pointer'}}
            onClick={handleCellClick}
        >

            {isEditing ? (
                    type === "category" ? (
                            <CategoryPicker onCategoryChange={(newValue) => {
                                setValue(newValue);
                                handleEdit();
                            }}/>
                        )
                        :
                        <Input
                            type={"text"}
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            onBlur={handleEdit}
                            onKeyDown={(e) => {
                                e.key === 'Enter' && handleEdit()
                            }}
                            className={isCurrency ? "text-center text-mono" : "text-left"}
                        />
                )
                :
                (
                    <span
                        style={{display: 'block', width: '100%', height: '100%'}}
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setIsEditing(true)
                        }}
                    >
                        {isCurrency ? `$${Number(value).toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}` : value}
                    </span>
                )
            }
        </TableCell>
    );

}