import Expenses from "@/components/Expenses";
import {Expense} from "@/lib/Interfaces";


export default function page() {
    interface TableSelectionProps {
        data: { avatar: string; name: string; email: string; job: string; id: string }[];
    }

    const data: Expense[] = [
        {
            id: "1",
            amount: 50,
            category: "Groceries",
            description: "Weekly grocery shopping",
            is_yearly: false,
            is_monthly: false,
            month: "January",
            name: "Grocery Shopping",
            year: 2023,
        },
        {
            id: "2",
            amount: 100,
            category: "Utilities",
            description: "Electricity bill",
            is_yearly: false,
            is_monthly: false,
            month: "February",
            name: "Electricity Bill",
            year: 2023,
        },
        {
            id: "3",
            amount: 2000,
            category: "Rent",
            description: "Monthly rent payment",
            is_yearly: false,
            is_monthly: true,
            month: "March",
            name: "Rent Payment",
            year: 2023,
        },
        {
            id: "4",
            amount: 500,
            category: "Insurance",
            description: "Car insurance premium",
            is_yearly: true,
            is_monthly: false,
            month: "April",
            name: "Car Insurance",
            year: 2023,
        }
    ];


    return (
        <>
            <div
                className={"text-2xl font-bold text-gray-800"}
            >
                Expenses
            </div>
            <Expenses data={data}/>
        </>
    )
}