import {DataTable} from "./data-table"
import {columns} from "./columns";
import {Expense} from "@/lib/Interfaces";

export default function page() {
    const fakeData: Expense[] =
        [
            {
                "id": "expense_001",
                "amount": 50.25,
                "categoryID": "cat_001",
                "vendor": "",
                "description": "Groceries",
                "is_yearly": false,
                "is_monthly": true,
                "month": 7,
                "name": "Monthly Grocery Expense",
                "date": "2023-07-15T12:34:56", // Replace with a valid timestamp or FieldValue
                "year": 2023
            },
            {
                "id": "expense_002",
                "amount": 1200.00,
                "categoryID": "cat_002",
                "vendor": "",
                "description": "Rent",
                "is_yearly": false,
                "is_monthly": true,
                "month": 7,
                "name": "Monthly Rent",
                "date": "2023-07-01T00:00:00", // Replace with a valid timestamp or FieldValue
                "year": 2023
            },
            {
                "id": "expense_003",
                "amount": 250.00,
                "categoryID": "cat_003",
                "vendor": "",
                "description": "Internet Bill",
                "is_yearly": false,
                "is_monthly": true,
                "month": 7,
                "name": "Monthly Internet Expense",
                "date": "2023-07-10T18:30:00", // Replace with a valid timestamp or FieldValue
                "year": 2023
            },
            {
                "id": "expense_004",
                "amount": 1200.00,
                "categoryID": "cat_004",
                "vendor": "",
                "description": "Car Insurance",
                "is_yearly": true,
                "is_monthly": false,
                "month": 1,
                "name": "Yearly Car Insurance",
                "date": "2023-01-05T09:00:00", // Replace with a valid timestamp or FieldValue
                "year": 2023
            },
            {
                "id": "expense_005",
                "amount": 80.00,
                "categoryID": "cat_005",
                "vendor": "",
                "description": "Gym Membership",
                "is_yearly": true,
                "is_monthly": false,
                "month": 1,
                "name": "Yearly Gym Membership",
                "date": "2023-01-01T08:00:00", // Replace with a valid timestamp or FieldValue
                "year": 2023
            }
        ]

    return (
        <>
            <div className="container mx-auto py-10">
                <DataTable columns={columns} data={fakeData}/>
            </div>


        </>
    )
}