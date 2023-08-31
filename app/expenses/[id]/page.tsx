"use client"
import {fakeData} from "@/lib/fakeData/fakeExpenseData";
// import {Button} from "@/components/ui/button";
import {Button, useMantineColorScheme} from "@mantine/core";

export default function Page({params}: { params: { id: string } }) {
    // TODO: find expense in Database and fill with info
    const expense = fakeData[0];
    const {colorScheme} = useMantineColorScheme();
    const id = params.id;


    return (
        <div className={`${colorScheme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
            <div className={""}>
                {expense.name}

            </div>
            <div className="">
                ${expense.amount.toFixed(2)}
            </div>
            <div className="">
                <span className={"font-bold"}>
                    Category:
                </span>
                <span className={"pl-1"}>


                </span>

            </div>
            <div className={"underline pt-3"}>
                Actions
            </div>
            <div className={"flex gap-3"}>
                <Button variant={"outline"}>
                    Edit
                </Button>
                <Button variant={"outline"} color={"red"}>
                    Delete
                </Button>
            </div>
        </div>
    )
}