"use client";
import { useAuth } from "@/app/context";
import { useState } from "react";
import { useGoals, addNewGoal } from "@/lib/firebase";
import { Goal } from "@/lib/Interfaces"
import GoalCard from "@/components/GoalCard";

import { Grid, Card, Flex, Button, Color, Select, SelectItem } from "@tremor/react";
import {useMantineColorScheme} from "@mantine/core";

import AddGoalForm from "@/components/AddEditGoalForm";

function sortByAmt(a: Goal, b: Goal) {
    return a.amt_goal < b.amt_goal ? -1 : 1;
}

function sortByName(a: Goal, b: Goal) {
    return a.goal_name < b.goal_name ? -1 : 1;
}

function sortByDate(a: Goal, b: Goal) {
    return a.goal_date < b.goal_date ? -1 : 1;
}

export default function Page () {
    const {user, loading} = useAuth();
    const {colorScheme} = useMantineColorScheme();

    const goals: Goal[] | null = useGoals(user);

    const [showForm, setShowForm] = useState(false);
    const colors = ["amber", "indigo", "violet", "rose", "cyan"];
    const [sortFn, setSortFn] = useState('date')

    return (
        <div className={colorScheme == "dark" ? "dark" : ""}>
            <p>Goals Page</p>

            <Flex flexDirection="row" className="w-1/3 justify-self-end">
                <p>Sort By</p>
                <Select value={sortFn} onValueChange={setSortFn} enableClear={false} >
                    <SelectItem value='date'>
                    Date
                    </SelectItem>
                    <SelectItem value='name'>
                    Goal Name
                    </SelectItem>
                    <SelectItem value='amount'>
                    Goal Amount
                    </SelectItem>
                </Select>
            </Flex>

            <Grid numItems={1} numItemsMd={2} numItemsLg={3} className="gap-2 p-2">
                {goals && goals.sort(sortFn === 'date' ? sortByDate : sortFn === 'name' ? sortByName : sortByAmt)
                .map((goal: Goal, idx: number) => {
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

