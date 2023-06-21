export interface Category {
    id: string;
    month: string;
    budget: number;
    category_name: string;
    year: number;
    spent: number;
}

export interface Expense{
    id: string;
    amount: number;
    category: string;
    description: string;
    is_yearly: boolean;
    month: string;
    name: string;
    timestamp: Date;
    year: number;
}