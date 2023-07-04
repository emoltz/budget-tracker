export interface Category {
    id: string;
    month: string;
    budget: number;
    category_name: string;
    year: number;
    spent: number;
}

export interface Expense {
    id: string;
    amount: number;
    category: string;
    description: string;
    is_yearly: boolean;
    is_monthly: boolean;
    month: string;
    name: string;
    // timestamp: Date;
    year: number;
}

export class CategoryClass implements Category{
    month = "";
    budget = 0;
    category_name = "";
    year = 0;
    spent = 0;
    id = "";

    // @ts-ignore
    constructor(month, budget, category_name, year, spent) {
        this.id = category_name + "_" + month + year;
        this.month = month;
        this.budget = budget;
        this.category_name = category_name;
        this.year = year;
        this.spent = spent;
    }


    toObject() {
        return {
            category_name: this.category_name,
            budget: this.budget,
            month: this.month,
            year: this.year,
            spent: this.spent,
            id: this.id,
        }
    }
}

export class ExpenseClass implements Expense {
    id = "";
    amount = 0;
    category = "";
    description = "";
    is_yearly = false;
    month = "";
    name = "";
    // timestamp = new Date();
    year = 0;
    is_monthly = false;

    // @ts-ignore

    constructor(amount, category, description, is_monthly, is_yearly) {
        this.id = category + "_" + description + "_" + amount;
        this.amount = amount;
        this.category = category;
        this.description = description;
        this.is_monthly = is_monthly;
        this.is_yearly = is_yearly;
        this.year = new Date().getFullYear();
        this.month = new Date().getMonth().toString();
    }

    toObject() {
        return {
            amount: this.amount,
            category: this.category,
            description: this.description,
            is_yearly: this.is_yearly,
            month: this.month,
            name: this.name,
            // timestamp: this.timestamp,
            year: this.year,
            id: this.id,
        }
    }

}