import {FieldValue, serverTimestamp, Timestamp} from "@firebase/firestore";

export type User = {
    uid: string;
    email: string;
    photoURL: string | null;
}

export type Month = {
    month: number;
    year: number;
    totals: {
        monthTotal: number;
        budgetTotals: {
            [budgetID: string]: number;
        }
    }
}

export type Budget = {
    budgetID: string;
    name: string;
    amount: number;
    is_monthly: boolean;
    icon: string | null;
}

export type Budgets = {
    budgets: Budget[];
}

export class BudgetClass implements Budget {
    budgetID: string = "";

    constructor(public name: string, public icon: string | null, public amount: number = 0, public is_monthly: boolean = false) {
        this.budgetID = this.generateBudgetId();
        this.name = name;
        this.icon = icon;
        this.amount = amount;
        this.is_monthly = is_monthly;
    }

    generateBudgetId(): string {
        // Get current timestamp
        const timestamp = Date.now();
        // Construct the ID
        return `${this.name}_${timestamp}`;
    }

    toJson(): Budget {
        return {
            budgetID: this.budgetID,
            name: this.name,
            amount: this.amount,
            is_monthly: this.is_monthly,
            icon: this.icon
        }
    }

}

export type Expense = {
    // within Month
    id: string;
    name: string;
    vendor: string;
    description: string;
    budgetID: string;
    amount: number;
    date: Timestamp | FieldValue | Date | typeof serverTimestamp;
    month: number;
    year: number;
    is_monthly: boolean;
    is_yearly: boolean; // this is for yearly expenses
    is_deleted: boolean;
}

export type Expenses = {
    expenses: Expense[];
}

export class ExpenseClass implements Expense {
    date: Timestamp | FieldValue | Date | typeof serverTimestamp = serverTimestamp();
    id: string = "";
    constructor(

        public name: string,
        public budgetID: string,
        public amount: number,
        public month: number,
        public year: number,
        public description: string = "",
        public vendor: string = "",
        public is_monthly: boolean = false,
        public is_yearly: boolean = false,
        public is_deleted: boolean = false,
    ) {
        this.id = this.generateExpenseId();
        this.name = name;
        this.vendor = vendor;
        this.description = description;
        this.budgetID = budgetID;
        this.amount = amount;
        this.month = month;
        this.year = year;
        this.is_monthly = is_monthly;
        this.is_yearly = is_yearly;
        this.is_deleted = is_deleted;
    }

    generateExpenseId(): string {
        // Get current timestamp
        const timestamp = Date.now();
        // Construct the ID
        return `${this.name}_${timestamp}`;
    }

    toJson(): Expense {
        return {
            id: this.id,
            name: this.name,
            vendor: this.vendor,
            description: this.description,
            budgetID: this.budgetID,
            amount: this.amount,
            date: this.date,
            month: this.month,
            year: this.year,
            is_monthly: this.is_monthly,
            is_yearly: this.is_yearly,
            is_deleted: this.is_deleted
        }
    }

}


// GOALS
export type Goal = {
    id: string;
    goal_name: string;
    goal_date: Date;
    amt_goal: number;
    amt_saved: number;
    date_start: Date; // Timestamp | FieldValue | string;
}

export class GoalClass implements Goal {
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

    toJson() {
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

export type DateData = {
    month: number,
    year: number,
    monthName: string
}

export type Color = {
    name: string,
    displayName: string,
    value: string,
}

// CUSTOM BUTTONS
type CustomButtonAction = {
    cost: number,
    category: string,

}

export interface CustomButton {
    iconName: string;
    label: string;
    color: string;
    action: CustomButtonAction;
}

