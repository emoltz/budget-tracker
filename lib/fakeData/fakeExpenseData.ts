import {Expense} from "@/lib/Interfaces";

export const fakeData:  Expense[] = [
    {
        id: "1",
        name: 'Expense 1',
        amount: 100,
        vendor: 'Vendor 1',
        description: 'Description 1',
        category: 'Food',
        month: 8,
        monthID: "1_2021",
        date: new Date().toLocaleDateString(),
        year: 2023,
        is_monthly: false,
        is_yearly: false,
    }
];
