import {Expense} from "@/lib/Interfaces";

export const fakeData:  Expense[] = [
    {
        date: new Date(),
        id: "1",
        name: 'Expense 1',
        categoryID: 'Food',
        amount: 100,
        description: 'Description 1',
        vendor: 'Vendor 1',
        month: 8,
        year: 2023,
        is_monthly: false,
        is_yearly: false,
        is_deleted: false,
    }
];
