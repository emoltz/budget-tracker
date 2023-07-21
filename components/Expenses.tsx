"use client";
import {Expense} from "@/lib/Interfaces";

interface TableProps {
    data: any;
}

const sampleExmeplses: Expense[] = [
    {
        id: "1",
        amount: 50.63,
        categoryID: "Activities_1_2021",
        description: "Bought some food",
        is_yearly: false,
        is_monthly: true,
        month: 1,
        name: "Food",
        year: 2021,

    },
    {
        id: "2",
        amount: 100,
        categoryID: "Food_1_2021",
        description: "Bought some food",
        is_yearly: false,
        is_monthly: true,
        month: 1,
        name: "Food",
        year: 2021,

    },

]


export default function Expenses({data}: TableProps) {


    return (
        <>


        </>
    );
}