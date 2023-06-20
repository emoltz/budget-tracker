'use client';
import BudgetByCategory from "@/components/BudgetByCategory";


export default function Budgets() {
    let categories=['Food/Drink','Groceries','Activities','Personal Items','Transportation',
    'Home', 'Health'];
    return (
        <>
            <h1>Budgets</h1>
            <ul>
                {categories.map((category, index)=>{
                    return <BudgetByCategory key={index} name={category}></BudgetByCategory>
                }

                )}
            </ul>
            
        </>
    )
}