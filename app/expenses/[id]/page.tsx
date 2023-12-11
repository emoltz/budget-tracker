"use client"
import { useAuth } from "@/app/context";
import { Expense } from "@/lib/Interfaces";
import { getExpense } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useMantineColorScheme } from "@mantine/core";
import { useState, useEffect } from "react";
import { CategoryPicker } from "@/components/CategoryPicker";

export default function Page({ params }: { params: { id: string } }) {
    const { user, loading } = useAuth();
    const dummyExpense: Expense = {
        name: "Loading...",
        amount: 0,
        categoryID: "1",
        date: new Date(),
        id: "1",
        description: "",
        vendor: "",
        month: 0,
        year: 0,
        is_monthly: false,
        is_yearly: false,
        is_deleted: false
    }

    const [expense, setExpense] = useState<Expense>(dummyExpense);
    const [loadingExpense, setLoadingExpense] = useState<boolean>(true);
    const [date, setDate] = useState<Date>();
    const id = params.id;

    useEffect(() => {
        if (user) {
            getExpense(user, id).then((expense) => {
                setExpense(expense);
                setLoadingExpense(false);
            })

        }
    }, [params.id, user])
    const { colorScheme } = useMantineColorScheme();

    if (loading || loadingExpense) {
        return <div>Loading...</div>
    }
    return (
        <div className={"container p-3"}>
            <div className="">
                Name
                <Input
                    defaultValue={expense.name}
                />
            </div>
            <div className="">
                Category
                <CategoryPicker
                    onCategoryChange={function (category: string): void {
                       // TODO
                    }
                    } />
            </div>
            <div className="">
                Amount
                <Input
                defaultValue={expense.amount.toString()}
                 />

            </div>
            <div className="">
                Description
                <Input />

            </div>
            <div className="">
                Vendor
                <Input />

            </div>
            <div className="">
                <div className="">
                    Date
                </div>
                <div className="">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-[280px] justify-start text-left font-normal",
                                    !date && "text-muted-foreground"
                                )}
                            >
                                {/* <CalendarIcon className="mr-2 h-4 w-4" /> */}
                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>


            </div>

<Button>
    Save
</Button>


        </div>
    )
}