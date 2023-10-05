"use client";
import { useAuth } from "@/app/context";
import { useState } from "react";
import { useGoals, addNewGoal } from "@/lib/firebase";
import { Goal } from "@/lib/Interfaces"
import GoalCard from "@/components/GoalCard";

import { Grid, Card, Flex, Button, Color} from "@tremor/react";
import {useMantineColorScheme} from "@mantine/core";

import AddGoalForm from "@/components/AddEditGoalForm";


export default function Page () {
    const {user, loading} = useAuth();
    const {colorScheme} = useMantineColorScheme();

    const goals: Goal[] | null = useGoals(user);

    const [showForm, setShowForm] = useState(false);
    const colors = ["amber", "indigo", "violet", "rose", "cyan"];

    return (
        <div className={colorScheme == "dark" ? "dark" : ""}>
            <p>
            Goals Page
            </p>
            <Grid numItems={1} numItemsMd={2} numItemsLg={3} className="gap-2 p-2">
                {goals && goals.map((goal: Goal, idx: number) => {
                    return (
                        <GoalCard
                            user={user}
                            goal={goal}
                            idx={idx}
                            savedColor={colors[idx % colors.length] as Color}/>
                    )
                })}

                {/* Add new goal button and form toggle */}
                { showForm 
                ? <Card className="max-w-lg py-2">
                    <AddGoalForm 
                        onFormClose={() => setShowForm(false)}
                        onAddGoal={(name, amt, date) => addNewGoal(user, name, amt, date)}
                        onEditGoal={() => {}}
                        />
                    </Card>
                : <Card className="h-80">
                    <Flex justifyContent="center" className="h-full">
                        <Button 
                            size="lg"
                            onClick={() => setShowForm (true)}>
                            Add New Goal
                        </Button> 
                    </Flex>
                </Card>}
            </Grid>
        </div>
    );
}

