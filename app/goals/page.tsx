"use client";
import { useAuth } from "@/app/context";
import { useState } from "react";
import { useGoals, addNewGoal, editGoal, deleteGoal } from "@/lib/firebase";
import { Goal } from "@/lib/Interfaces"

import { Grid, Card, Flex, Icon, Title, DonutChart, Button, Color} from "@tremor/react";
import { NumberInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import {useMantineColorScheme} from "@mantine/core";

import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem} from "@/components/ui/dropdown-menu";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import { IconPencil, IconSettings } from "@tabler/icons-react";
import AddGoalForm from "@/components/AddNewGoalForm";

const valueFormatter = (number: number) => `$ ${Intl.NumberFormat("us").format(number).toString()}`;

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
                                        <DropdownMenuItem
                                            onSelect={() => deleteGoal(user, goal.id)}>
                                            Delete
                                        </DropdownMenuItem>
                                        {/* TODO: "are you sure"?,  toast to alert? */}
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
                                <AddToGoalPopover 
                                    updateAmount={(new_amt) => {
                                        goal.amt_saved += new_amt;
                                        editGoal(user, goal);
                                    }}
                                />
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
        </div>
    );
}

interface PopoverProps {
    updateAmount: (amt: number) => void
}

function AddToGoalPopover({ updateAmount } : PopoverProps) {
    const addForm = useForm({
        initialValues: {
          add_amount: 0,
        },
    
        validate: {
            //TODO: validate > 0
        //   email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
        },
      });

    return(
        <Popover>
            <PopoverTrigger>
                <Icon icon={IconPencil} variant="light"/> 
            </PopoverTrigger>
            <PopoverContent>
                <form onSubmit={addForm.onSubmit((values) => {
                        updateAmount(values.add_amount)
                        addForm.reset();
                    })}>
                    <Flex className="gap-2">
                        <NumberInput 
                            {...addForm.getInputProps("add_amount")}
                            />
                        <Button type="submit">Add</Button>
                    </Flex>
                </form>
            </PopoverContent>
        </Popover>
    )
}