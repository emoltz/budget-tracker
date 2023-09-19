"use client";
import { useAuth } from "@/app/context";
import { useState } from "react";
import { useGoals, addNewGoal, editGoal } from "@/lib/firebase";
import { Goal } from "@/lib/Interfaces"

import { Grid, Card, Flex, Icon, Title, DonutChart, Button, Color} from "@tremor/react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem} from "@/components/ui/dropdown-menu";
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
                        <Card className="max-w-lg py-2 h-72">
                            <Flex>
                                <Title>{goal.goal_name}</Title>
                                
                                <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        <Icon icon={IconSettings}
                                        color = "gray"
                                    />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem
                                            onSelect={() => alert("edit")}>
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </Flex>

                            <DonutChart
                                className="mt-6"
                                data={goalData}
                                category="amount"
                                index="tag"
                                valueFormatter={valueFormatter}
                                colors={[colors[idx % colors.length] as Color, "slate"]}
                            />
                            <Flex justifyContent="end">
                                <Button icon={IconPencil}/>   
                            </Flex>
                            
                        </Card>
    
                    )
                })}

                { showForm 
                ? <AddGoalForm 
                    onFormClose={() => setShowForm(false)}
                    onAddGoal={(name, amt, date) => addNewGoal(user, name, amt, date)}
                    />
                : <Card className="h-72">
                    <Flex justifyContent="center" className="h-full">
                        <Button 
                            size="lg"
                            onClick={() => setShowForm (true)}>
                            Add New Goal
                        </Button> 
                    </Flex>
                </Card>}

            </Grid>
        </>
    );
}