import React from "react";

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
    amount: number;
    category: string;
    description: string;
    is_yearly: boolean;
    is_monthly: boolean;
    month: number;
    name: string;
    // timestamp: Date;
    year: number;
}

export interface User {
    display_name: string;
    email: string;
    photo_url: string;
    uid: string;
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
    description = "";
    is_yearly = false;
    month: number = -1;
    name = "";
    // timestamp = new Date();
    year = 0;
    is_monthly = false;



    constructor(amount:number, category:string, name:string, description: string, is_monthly:boolean, is_yearly:boolean) {
        // random number
        const random = Math.floor(Math.random() * 10000);
        this.amount = amount;
        this.category = category;
        this.name = name;
        this.description = description;
        this.is_monthly = is_monthly;
        this.is_yearly = is_yearly;
        this.year = new Date().getFullYear();
        this.month = new Date().getMonth() + 1;
        this.id = category + "_" + name + "_" + amount + "_" + random;
    }

    toObject() {
        // this is for sending it to firebase, making sure it is in the correct format
        return {
            amount: this.amount,
            category: this.category,
            description: this.description,
            name: this.name,
            is_yearly: this.is_yearly,
            is_monthly: this.is_monthly,
            month: this.month,
            year: this.year,
            id: this.id,
        }
    }

    getCategoryID(): string{
        // this helps us marry it to the category inside Firebase
        return this.category + "_" + this.month + "_"+ this.year;
    }

    changeAmount(newAmount: number): void {
        this.amount = newAmount;
    }

    changeCategory(newCategory: string): void {
        this.category = newCategory;
    }

    changeDescription(newDescription: string): void {
        this.description = newDescription;
    }

}