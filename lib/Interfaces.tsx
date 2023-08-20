import {FieldValue, serverTimestamp, Timestamp} from "@firebase/firestore";

export interface Budget {
    id: string;
    category_name: string;
    amount: number;
    is_monthly: boolean;
    is_yearly: boolean;
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

// TODO: whether or not to keep a copy of expenses here
export interface Category {
    id: string;
    category_name: string;
    month: string;
    year: number;
    spent: number;
    budget: number;
    // expenses: string[];
    iconName: string;
}

export class CategoryClass implements Category {
    id = "";
    category_name = "";
    month = "";
    year = 0;
    spent = 0;
    budget = 0;
    // expenses: string[] = [];
    iconName: string = "dashboard";


    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    constructor(category_name, month, year, spent, budget) {
        this.id = category_name + "_" + month + "_" + year;
        this.category_name = category_name;
        this.month = month;
        this.year = year;
        this.spent = spent;
        this.budget = budget;
    }


    toObject() {
        return {
            category_name: this.category_name,
            budget: this.budget,
            month: this.month,
            year: this.year,
            spent: this.spent,
            id: this.id,
            // expenses: this.expenses,
            icon: this.iconName
        }
    }
}

export interface Expense {
    id: string;
    name: string;
    amount: number;
    vendor: string;
    description: string; // or "notes"
    category: string;
    categoryID: string;
    date: Timestamp | FieldValue | string;
    month: number;
    year: number;
    is_yearly: boolean;
    is_monthly: boolean;
}

export class ExpenseClass implements Expense {
    id = "";
    amount = 0;
    category = "";
    categoryID = "";
    vendor = "";
    description = "";
    is_yearly = false;
    month: number = -1;
    name = "";
    date = serverTimestamp();
    year = 0;
    is_monthly = false;


    constructor(amount: number, categoryName: string, name: string, vendor: string, description: string, is_monthly: boolean, is_yearly: boolean) {
        // random number
        const newID: string = this.generateExpenseId(categoryName);
        this.amount = amount;
        this.name = name;
        this.vendor = vendor;
        this.description = description;
        this.is_monthly = is_monthly;
        this.is_yearly = is_yearly;
        this.year = new Date().getFullYear();
        this.month = new Date().getMonth() + 1;
        this.id = newID;
        this.category = categoryName;
        this.categoryID = this.getCategoryID(categoryName);
    }

    generateExpenseId(categoryId: string): string {
        // Get current timestamp
        const timestamp = Date.now();

        // Construct the ID
        return `${categoryId}_${timestamp}`;
    }

    toObject() {
        // this is for sending it to firebase, making sure it is in the correct format
        return {
            amount: this.amount,
            category: this.category,
            categoryID: this.categoryID,
            description: this.description,
            name: this.name,
            vendor: this.vendor,
            date: this.date,
            is_yearly: this.is_yearly,
            is_monthly: this.is_monthly,
            month: this.month,
            year: this.year,
            id: this.id,
        }
    }

    getCategoryID(categoryName: string): string {
        // this helps us marry it to the category inside Firebase
        return categoryName + "_" + this.month + "_" + this.year;
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

export interface MonthSummary {
    month: number;
    year: number;
    monthTotal: number;
    categoryTotals: Category[];
}

export class MonthSummaryClass implements MonthSummary {
    month = 0;
    year = 0;
    monthTotal = 0;
    categoryTotals : Category[] = [];
    
    // whenever MonthSummaryClass is created, make a call to find icons and budget
    constructor(summary: MonthSummary) {
        this.month = summary.month;
        this.year = summary.year;
        this.monthTotal = summary.monthTotal;

        // summary.categoryTotals should already be a list of Categories
        this.categoryTotals = summary.categoryTotals;
    }

    // constructor(month: number, year: number, monthTotal: number, categoryTotals:{}) {
    //     this.month = month;
    //     this.year = year;
    //     this.monthTotal = monthTotal;
    //     this.categoryTotals = categoryTotals;
    // }

    toObject() {
        return {
            month: this.month,
            year: this.year,
            monthTotal: this.monthTotal,
            categoryTotals: this.categoryTotals
        }
    }

    // return totals as list of dicts
    // TODO: get icons in here somehow

    // getTotals() {
    //     const totals: Category[] = [];

    //     if (this.categoryTotals !== undefined) {
    //         Object.entries(this.categoryTotals).forEach((category) => {
    //             totals.push({
    //                 id: category.id,
    //                 category : category.category_name, 
    //                 month: category.month,
    //                 year: category.year,
    //                 spent: category.spent,
    //                 budget: category.budget,
    //                 // expenses: string[];
    //                 iconName: iconName
    //             } as Category)
    //         });
    //     }
    //     return totals;
    // }

}