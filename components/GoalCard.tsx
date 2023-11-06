"use client";
import { useState } from "react";
import { Goal } from "@/lib/Interfaces";
import { editGoal, deleteGoal } from "@/lib/firebase";
import { User } from "firebase/auth";

import { NumberInput } from "@mantine/core";
import { useForm } from "@mantine/form";

import { Card, Flex, Icon, Title, DonutChart, Color, Button} from "@tremor/react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem} from "@/components/ui/dropdown-menu";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import { IconPencil, IconSettings } from "@tabler/icons-react";
import EditGoalForm from "./AddEditGoalForm";

const valueFormatter = (number: number) => `$ ${Intl.NumberFormat("us").format(number).toString()}`;

interface GoalCardProps {
    user: User | null
    goal: Goal
    idx: number
    savedColor: Color
}

export default function GoalCard ({user, goal, idx, savedColor} : GoalCardProps) {
    const [showEditForm, setShowEditForm] = useState(false);

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
        <Card className="max-w-lg py-2 h-80">
            {showEditForm ?
            <EditGoalForm 
                onFormClose={() => setShowEditForm(false)}
                onAddGoal={() => {}}
                onEditGoal={(goal) => editGoal(user, goal)}
                currentGoal={goal}
                />
            :
            <div>
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
                                onSelect={() => setShowEditForm(true)}>
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

                <p>{new Date(goal.goal_date).toDateString()}</p>
                {/* <Title>{goal.goal_date.getDate()}</Title> */}

                <DonutChart
                    className="mt-6"
                    data={goalData}
                    category="amount"
                    index="tag"
                    valueFormatter={valueFormatter}
                    colors={[savedColor, "slate"]}
                />
                <Flex justifyContent="end">
                    <AddToGoalPopover 
                        updateAmount={(new_amt) => {
                            goal.amt_saved += new_amt;
                            editGoal(user, goal);
                        }}
                    />
                </Flex>
            </div>
            }
        </Card>
    )
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
            add_amount: (value) => (value > 0 ? null
                : (value === 0 ? "Amount cannot be zero" : "Amount cannot be negative")),
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