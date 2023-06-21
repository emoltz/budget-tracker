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
            month: "January",
            name: "Grocery Shopping",
            timestamp: new Date("2023-01-15"),
            year: 2023,
        },
        {
            id: "2",
            amount: 100,
            category: "Utilities",
            description: "Electricity bill",
            is_yearly: false,
            month: "February",
            name: "Electricity Bill",
            timestamp: new Date("2023-02-10"),
            year: 2023,
        },
        {
            id: "3",
            amount: 2000,
            category: "Rent",
            description: "Monthly rent payment",
            is_yearly: false,
            month: "March",
            name: "Rent Payment",
            timestamp: new Date("2023-03-01"),
            year: 2023,
        },
        {
            id: "4",
            amount: 500,
            category: "Insurance",
            description: "Car insurance premium",
            is_yearly: true,
            month: "April",
            name: "Car Insurance",
            timestamp: new Date("2023-04-05"),
            year: 2023,
        },
        // Repeat the above objects with different values to generate more dummy data
        {
            id: "5",
            amount: 75,
            category: "Groceries",
            description: "Weekly grocery shopping",
            is_yearly: false,
            month: "May",
            name: "Grocery Shopping 2",
            timestamp: new Date("2023-05-10"),
            year: 2023,
        },
        {
            id: "6",
            amount: 200,
            category: "Utilities",
            description: "Water bill",
            is_yearly: false,
            month: "June",
            name: "Water Bill",
            timestamp: new Date("2023-06-15"),
            year: 2023,
        },
        {
            id: "7",
            amount: 150,
            category: "Dining Out",
            description: "Dinner at a fancy restaurant",
            is_yearly: false,
            month: "July",
            name: "Fancy Dinner",
            timestamp: new Date("2023-07-20"),
            year: 2023,
        },
        {
            id: "8",
            amount: 300,
            category: "Travel",
            description: "Flight ticket for vacation",
            is_yearly: false,
            month: "August",
            name: "Vacation Flight",
            timestamp: new Date("2023-08-05"),
            year: 2023,
        },
        {
            id: "9",
            amount: 50,
            category: "Entertainment",
            description: "Movie tickets",
            is_yearly: false,
            month: "September",
            name: "Movie Night",
            timestamp: new Date("2023-09-12"),
            year: 2023,
        },
        {
            id: "10",
            amount: 1000,
            category: "Shopping",
            description: "New wardrobe",
            is_yearly: false,
            month: "October",
            name: "Shopping Spree",
            timestamp: new Date("2023-10-25"),
            year: 2023,
        },
        {
            id: "11",
            amount: 200,
            category: "Healthcare",
            description: "Dental check-up",
            is_yearly: true,
            month: "November",
            name: "Dental Appointment",
            timestamp: new Date("2023-11-10"),
            year: 2023,
        },
    ];


    return (
        <>
            <div
                className={"text-2xl font-bold text-gray-800"}
            >
                    Expenses</div>
            <Expenses data={data}/>
        </>
    )
}