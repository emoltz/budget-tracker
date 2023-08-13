import {FieldValue, serverTimestamp, Timestamp} from "@firebase/firestore";

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
    description: string;
    category: string;
    categoryID: string;
    date: Timestamp | FieldValue | String;
    month: number;
    year: number;
    is_yearly: boolean;
    is_monthly: boolean;
}

export interface User {
    uid: string;
    display_name: string;
    email: string;
    // below could be its own interface
    categories: {[category: string] : string};
    photo_url: string;
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

    addExpense(expenseID: string) {
        this.expenses.push(expenseID);
    }

    changeBudget(newBudget: number) {
        this.budget = newBudget;
    }
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

// should have budget and icons
// similar to Category, this is just here before the above gets implemented
interface CategorySummary {
    category : string,
    amount : number
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
        this.month = summary.month,
        this.year = summary.year;
        this.monthTotal = summary.monthTotal;
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
    getTotals() {
        const totals: CategorySummary[] = [];
        Object.entries(this.categoryTotals).forEach(([k, v]) => {
            totals.push({category : k, amount : v} as CategorySummary)
        });
        return totals;
    }

}