"use client";
import './globals.css';
import React from 'react';
import {useAuth} from "@/app/context";
import {rem,} from '@mantine/core';
import {ThreeColumnLayout} from "@/components/layouts/ThreeColumnLayout";
import LoginMantine from "@/components/LoginMantine";
import AddNewExpense from "@/components/AddNewExpense";
import Loading from "@/app/loading";
import ComponentFrameCenter from "@/components/layouts/ComponentFrameCenter";
import BudgetCard from "@/components/BudgetCard";
import {useCategoryBudgets_currentMonth} from "@/lib/firebase";
import {CategoryBudget} from "@/lib/Interfaces";
import LoadingAtAGlance from "@/components/layouts/LoadingAtAGlance";

const PRIMARY_COL_HEIGHT = rem(400);

export default function Home() {
    const {user, loading} = useAuth();

    const categoryBudgets: CategoryBudget[] | null = useCategoryBudgets_currentMonth(user)

    if (loading) {
        return <Loading/>; // Or return a loading spinner
    }

    if (!user) {
        return <LoginMantine/>;
    }


    return (
        <>
            <ThreeColumnLayout
                one={<></>}
                two={<></>}
                three={<AtAGlance
                    // userData={userData}
                    // user={user}
                    categoryBudgets={categoryBudgets}
                />}
            />
        </>
    )
}

const Actions = () => {
    return (
        <ComponentFrameCenter
            PRIMARY_COL_HEIGHT={PRIMARY_COL_HEIGHT}
            title={"Add New"}
        >
            <AddNewExpense/>
        </ComponentFrameCenter>
    )
}

interface AtAGlanceProps {
    categoryBudgets: CategoryBudget[] | null;
}

const AtAGlance = ({categoryBudgets}: AtAGlanceProps) => {

    return (

        <>
            <ComponentFrameCenter
                PRIMARY_COL_HEIGHT={"600px"}
                title={"At a Glance"}
            >
                <div
                    className={"grid md:grid-cols-2 sm:grid-cols-1 gap-5"}
                >

                    {categoryBudgets ? categoryBudgets.map((category: CategoryBudget, idx: number) => {
                            return (
                                <BudgetCard
                                    key={idx}
                                    id={idx.toString()}
                                    budgetName={category.category}
                                    budgetAmount={category.budgetAmount}
                                    spent={category.spent}
                                    iconName={category.icon}
                                />
                            )
                        }) :
                        <LoadingAtAGlance/>
                    }
                </div>


            </ComponentFrameCenter>
        </>
    )
}


