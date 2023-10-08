import {FieldValue, serverTimestamp, Timestamp} from "@firebase/firestore";

export interface Budget {
    id: string;
    category_name: string;
    amount: number;
    spent?: number; // adding this as a computed value
    is_monthly: boolean;
    is_yearly: boolean;
    icon?: string;
}

export class BudgetClass {
    id = "";
    category_name = "";
    amount = 0;
    is_monthly = false;
    is_yearly = false;


    constructor(category_name: string, amount: number, is_monthly?: boolean, is_yearly?: boolean) {
        this.id = this.generateBudgetId(category_name)
        this.category_name = category_name;
        this.amount = amount;
        this.is_monthly = is_monthly ?? true;
        this.is_yearly = is_yearly ?? false;

    }

    generateBudgetId(category_name: string): string {
        // Get current timestamp
        const timestamp = Date.now();

        // Construct the ID
        return `${category_name}_${timestamp}`;
    }

    toObject() {
        return {
            id: this.id,
            category_name: this.category_name,
            amount: this.amount,
            is_monthly: this.is_monthly,
            is_yearly: this.is_yearly
        }
    }
}

export interface Category {
    id: string;
    month: string;
    budget: number;
    category_name: string;
    year: number;
    spent: number;
    expenses: string[];
    iconName: string;
}

export interface Expense {
    id: string;
    name: string;
    amount: number;
    vendor: string;
    description: string; // or "notes"
    category: string;
    monthID: string;
    date: Timestamp | FieldValue | string;
    month: number;
    year: number;
    is_monthly: boolean;
    is_yearly?: boolean; // get ready for removal
    is_deleted: boolean;
}

export interface MonthSummary {
    month: number;
    year: number;
    monthTotal: number;
    categoryTotals: {[category: string] : number};
}

export class CategoryClass implements Category {
    month = "";
    budget = 0;
    category_name = "";
    year = 0;
    spent = 0;
    id = "";
    expenses: string[] = [];
    iconName: string = "dashboard";


    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    constructor(month, budget, category_name, year, spent) {
        this.id = category_name + "_" + month + "_" + year;
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
            expenses: this.expenses,
            icon: this.iconName
        }
    }
}

export class ExpenseClass implements Expense {
    id = "";
    amount = 0;
    category = "";
    monthID = "";
    vendor = "";
    description = "";
    is_yearly = false;
    month: number = -1;
    name = "";
    date = serverTimestamp();
    year = 0;
    is_monthly = false;
    is_deleted = false;


    constructor(amount: number, categoryName: string, name: string, vendor?: string, description?: string, is_monthly?: boolean, is_yearly?: boolean) {
        // random number
        const newID: string = this.generateExpenseId(name);
        this.category = categoryName;
        this.amount = amount;
        this.name = name;
        this.vendor = vendor ?? "";
        this.description = description ?? "";
        this.is_monthly = is_monthly ?? false;
        this.is_yearly = is_yearly ?? false;
        this.year = new Date().getFullYear();
        this.month = new Date().getMonth() + 1;
        this.id = newID;
        this.monthID = this.getMonthID();
    }

    generateExpenseId(name: string): string {
        // Get current timestamp
        const timestamp = Date.now();

        // Construct the ID
        return `${name}_${timestamp}`;
    }

    toObject() {
        // this is for sending it to firebase, making sure it is in the correct format
        return {
            amount: this.amount,
            category: this.category,
            description: this.description,
            name: this.name,
            vendor: this.vendor,
            date: this.date,
            is_yearly: this.is_yearly,
            is_monthly: this.is_monthly,
            month: this.month,
            year: this.year,
            monthID: this.monthID,
            id: this.id,
            is_deleted: this.is_deleted
        }
    }

    getMonthID(): string {
        // this helps us marry it to the category inside Firebase
        return this.month + "_" + this.year;
    }

}

// function validateCategoryID(categoryID: string): boolean {
//     // Split the ID by underscore
//     const parts = categoryID.split("_");
//
//     // Check that there are exactly three parts
//     if (parts.length !== 3) return false;
//
//     // Extract parts
//     const [category_name, month, year] = parts;
//
//     // Check that month and year are in the correct formats (modify these checks as needed)
//     if (!/^\w+$/.test(category_name)) return false; // Ensure category_name consists of word characters
//     if (!/^[A-Za-z]+$/.test(month)) return false; // Ensure month consists of letters
//     if (!/^\d{4}$/.test(year)) return false; // Ensure year consists of exactly four digits
//
//     return true; // If all checks pass, return true
// }

// should have budget and icons
// similar to Category, this is just here before the above gets implemented
export interface CategoryBudget {
    category : string,
    budgetAmount: number,
    spent: number,
    icon?: string,
}

export class MonthSummaryClass implements MonthSummary {
    month = 0;
    year = 0;
    monthTotal = 0;

    // make this a list of categorySummaries
    // whenever MonthSummaryClass is created, make a call to find icons and budget
    // this could also link back to expenses?
    categoryTotals = {};


    constructor(summary: MonthSummary) {
        this.month = summary.month;
        this.year = summary.year;
        this.monthTotal = summary.monthTotal;
        this.categoryTotals = summary.categoryTotals;
    }

    toObject() {
        return {
            month: this.month,
            year: this.year,
            monthTotal: this.monthTotal,
            categoryTotals: this.categoryTotals
        }
    }

    getTotals() {
        const totals: CategoryBudget[] = [];

        if (this.categoryTotals !== undefined) {
            Object.entries(this.categoryTotals).forEach(([k, v]) => {
                totals.push({category : k, budgetAmount : v} as CategoryBudget)
            });
        }
        return totals;
    }

}

export interface Goal{
    id: string;
    goal_name: string;
    goal_date: Date;
    amt_goal: number;
    amt_saved: number;
    date_start: Date; // Timestamp | FieldValue | string;
    
}

export class GoalClass implements Goal{
    id = "";
    goal_name = "";
    goal_date = new Date();
    amt_goal = 0;
    amt_saved = 0;
    date_start = new Date();
    

    constructor(goal_name: string, amount: number, goal_date: Date,) {
        this.id = this.generateGoalId(goal_name)
        this.goal_name = goal_name;
        this.goal_date = goal_date;
        this.amt_goal = amount;
        this.amt_saved = 0;
        this.date_start = new Date();
    }

    generateGoalId(goal_name: string): string {
        // Get current timestamp
        const timestamp = Date.now();

        // Construct the ID
        return `${goal_name}_${timestamp}`;
    }

    toObject() {
        return {
            id: this.id,
            goal_name: this.goal_name,
            goal_date: this.goal_date,
            amt_goal: this.amt_goal,
            amt_saved: this.amt_saved,
            date_start: this.date_start
        }
    }
}

export interface DateData{
    month: number,
    year: number,
    monthName: string
}

export interface Color {
    name: string,
    displayName: string,
    value: string,
}

// CUSTOM BUTTONS
interface CustomButtonAction{
    cost: number,
    category: string,

}

export interface CustomButton {
    iconName: string;
    label: string;
    color: string;
    action: CustomButtonAction;
}

