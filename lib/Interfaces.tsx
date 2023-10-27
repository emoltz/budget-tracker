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

export type Expense = {
    // within Month
    id: string;
    name: string;
    vendor: string;
    description: string;
    budgetID: string;
    date: Timestamp | FieldValue | Date | typeof serverTimestamp;
    month: number;
    year: number;
    is_monthly: boolean;
    is_yearly: boolean; // this is for yearly expenses
}

export type Expenses = {
    expenses: Expense[];
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

export type Color  ={
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

