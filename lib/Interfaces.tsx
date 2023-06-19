export interface Category {
    month: string;
    budget: number;
    category_name: string;
    year: number;
    spent: number;
}

export interface Expenses{
    amount: number;
    category: string;
    description: string;
    is_yearly: boolean;
    month: string;
    name: string;
    timestamp: Date;
    year: number;
}