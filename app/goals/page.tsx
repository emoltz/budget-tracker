"use client";
import { useAuth } from "@/app/context";
import { useState } from "react";
import { useGoals, addNewGoal, editGoal } from "@/lib/firebase";
import { Goal } from "@/lib/Interfaces"

import { Grid, Card, Icon, Title, DonutChart, Button, Color} from "@tremor/react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import { IconPencil, IconSettings } from "@tabler/icons-react";
import AddGoalForm from "@/components/AddNewGoalForm";

const valueFormatter = (number: number) => `$ ${Intl.NumberFormat("us").format(number).toString()}`;

export default function Page () {
    const {user, loading} = useAuth();
    const goals: Goal[] | null = useGoals(user);

    const [showForm, setShowForm] = useState(false);
    const colors = ["amber", "indigo", "violet", "rose", "cyan"];

    return (
        <>
            <p>
            Goals Page
            </p>
            <Grid numItems={1} numItemsMd={2} numItemsLg={3} className="gap-2 p-2">
                {!goals
                ? <Card>
                    <p>No goals yet!</p>
                </Card>
                : goals.map((goal: Goal, idx: number) => {
                    const goalData = [
                        {
                          tag: "Saved so far",
                          amount: goal.amt_saved,
                        },
                        {
                          tag: "Left to go",
                          amount: goal.amt_goal - goal.amt_saved,
                        },
                      ];
                    return (
                        <Card className="max-w-lg py-2">
                            <div className="flex flex-row align-items-stretch">
                                <Title>{goal.goal_name}</Title>
                                <Icon icon={IconSettings}
                                    color = "gray"
                                    tooltip="Edit this goal"
                                    onClick={() => alert("Edit test")}
                                />
                            </div>
                            <Button icon={IconPencil}/>    
                            
                            
                            <DonutChart
                                className="mt-6"
                                data={goalData}
                                category="amount"
                                index="tag"
                                valueFormatter={valueFormatter}
                                colors={[colors[idx % colors.length] as Color, "slate"]}
                            />
                        </Card>
    
                    )
                })}

                { showForm 
                ? <AddGoalForm 
                    onFormClose={() => setShowForm(false)}
                    onAddGoal={(name, amt, date) => addNewGoal(user, name, amt, date)}
                    />
                : <Button 
                    size="lg"
                    onClick={() => setShowForm (true)}>
                    Add New Goal
                </Button> }


            </Grid>
        </>
    
    );
}