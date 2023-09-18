import { Card, Title, Button } from "@tremor/react";
import { TextInput, NumberInput } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';


interface Props {
    onFormClose: () => void,
    onAddGoal: (name: string, amt: number, date: Date) => void,
}

export default function AddGoalForm ({ onFormClose, onAddGoal }: Props) {
    const form = useForm({
        initialValues: {
          goalName: '',
          goalAmount: 0,
          goalDate: new Date(),
        },

        // TODO: validate goal amt > 0, date > today
      });

    return (
        <>
            <Card className="max-w-lg py-2">  
                <Title>New Goal</Title>
                <form onSubmit={form.onSubmit((values) => {
                    onAddGoal(values.goalName, values.goalAmount, values.goalDate);
                    form.reset();
                    onFormClose();
                })}>
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
                        {...form.getInputProps('goalDate')}
                    />
                    <Button type="submit">Save</Button>
                    <Button variant="secondary" onClick={ onFormClose }>Close</Button>
                </form>

            </Card>
        </>
    );
}