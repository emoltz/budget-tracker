import { Flex, Title, Button } from "@tremor/react";
import { TextInput, NumberInput } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { Goal } from "@/lib/Interfaces";


interface Props {
    onFormClose: () => void,
    onAddGoal: (name: string, amt: number, date: Date) => void,
    onEditGoal: (goal: Goal) => void,
    currentGoal?: Goal,
}

export default function AddGoalForm ({ onFormClose, onAddGoal, onEditGoal, currentGoal }: Props) {
    const form = useForm({
        initialValues: {
          goalName: currentGoal ? currentGoal.goal_name : '',
          goalAmount: currentGoal ? currentGoal.amt_goal : 0,
          goalDate: currentGoal ? new Date(currentGoal.goal_date) : new Date(),
        },
        validate: {
            goalAmount: (value) => (value > 0 ? null
                : (value === 0 ? "Amount cannot be zero" : "Amount cannot be negative")),
            goalDate: (value) => (value < new Date() ? "Data goal must be in the future" : null),
        }
      });

      console.log(currentGoal?.goal_date);

    return (
        <>
            <Title>{currentGoal ? currentGoal.goal_name : "New Goal"}</Title>
            <form onSubmit={form.onSubmit((values) => {
                if (currentGoal) {
                    currentGoal.goal_name = values.goalName;
                    currentGoal.amt_goal = values.goalAmount;
                    currentGoal.goal_date = values.goalDate as Date;
                    onEditGoal(currentGoal);
                } else {
                    onAddGoal(values.goalName, values.goalAmount, values.goalDate);
                }

                form.reset();
                onFormClose();
            })}>
                <Flex flexDirection="col" alignItems="stretch" className="gap-2" >
                    <TextInput
                        placeholder="Vacation"
                        label="Goal Title"
                        {...form.getInputProps('goalName')}
                    />
                    <NumberInput
                        label="Goal Amount"
                        defaultValue={1000}
                        parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                        formatter={(value) =>
                            !Number.isNaN(parseFloat(value))
                            ? `$ ${value}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
                            : '$ '
                        }
                        {...form.getInputProps('goalAmount')}
                    />
                    <DateInput
                        label="Target Date"
                        placeholder="Date input"
                        mx="auto"
                        style={{width: "100%"}}
                        {...form.getInputProps('goalDate')}
                    />
                    <Flex justifyContent="end" className="gap-2">
                        <Button type="submit">Save</Button>
                        <Button variant="secondary" onClick={ onFormClose }>Close</Button>
                    </Flex>
                </Flex>
            </form>
        </>
    );
}