'use client';
import BudgetByCategory from "@/components/BudgetByCategory";
import {
    FiHome,
    FiTrendingUp,
    FiCompass,
    FiStar,
    FiSettings,
    FiMenu,
    FiBell,
    FiChevronDown,
} from 'react-icons/fi';
import {Category} from "@/lib/Interfaces";

export default function Budgets() {
    let categories = ['Food/Drink', 'Groceries', 'Activities', 'Personal Items', 'Transportation',
        'Home', 'Health'];
    // Dummy data
    const Categories: Category[] = [
        {
            id: "1",
            month: "January",
            budget: 1000,
            category_name: "Food",
            year: 2023,
            spent: 500,
        },
        {
            id: "2",
            month: "February",
            budget: 1500,
            category_name: "Rent",
            year: 2023,
            spent: 1200,
        },
        {
            id: "3",
            month: "March",
            budget: 800,
            category_name: "Entertainment",
            year: 2023,
            spent: 600,
        },
        {
            id: "4",
            month: "April",
            budget: 2000,
            category_name: "Transportation",
            year: 2023,
            spent: 1800,
        },
        {
            id: "5",
            month: "May",
            budget: 1200,
            category_name: "Utilities",
            year: 2023,
            spent: 1000,
        },
    ];

    return (
        <>
            <h1>Budgets</h1>
            <ul>
                {categories.map((category, index) => {
                        return <BudgetByCategory key={index}
                                                 category={category}


                        ></BudgetByCategory>
                    }
                )}
            </ul>

        </>
    )
}