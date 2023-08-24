import {Button, Group, NumberInput, Radio, TextInput} from "@mantine/core";
import {useForm} from '@mantine/form';
import {FiPlus} from "react-icons/fi";
import React from "react";
import {ExpenseClass} from "@/lib/Interfaces";
import {CategoryPicker} from "@/components/CategoryPicker";
import {useAuth} from "@/app/context";
import {sendExpenseToFirebaseNew} from "@/lib/firebase";

export default function AddNewExpense() {
    const {user, loading} = useAuth();

    const form = useForm({
        initialValues: {
            amount: 0,
            name: "",
            vendor: "",
            description: "",
            category: "",
            is_monthly: false,
            is_yearly: false,
        },
        validate: {
            amount: (value) => (value > 0 ? null 
                             : (value === 0 ? "Amount cannot be zero" : "Amount cannot be negative") ),
            name: (value) => (value === "" ? "Please enter a name for the expense" : null),
            category: (value) => (value === "" ? "Please choose a category" : null)
        }
    });

    const [selectedFrequency, setSelectedFrequency] = React.useState<string>("once");

    const handleCategoryChange = (category: string) => {
        form.setFieldValue('category', category);
        console.log(category);
    }
    return (
        <div
            className={"flex justify-center items-center"}
        >
            <form onSubmit={form.onSubmit((values) => {
                if (!user) {
                    console.error("User is not logged in!")
                    return;
                }

                const expense: ExpenseClass = new ExpenseClass(
                    values.amount,
                    values.category,
                    values.name,
                    values.vendor,
                    values.description,
                    values.is_monthly,
                    values.is_yearly,
                );
                // console.log(expense)

                sendExpenseToFirebaseNew(user, expense).then(() => {
                    form.reset();
                    console.log("Expense sent on tsx file: ", expense);
                });
            })}>
                <TextInput
                    placeholder={"Name"}
                    {...form.getInputProps('name')}
                />
                <NumberInput
                    defaultValue={0.00}
                    precision={2}
                    min={-1}
                    step={1}
                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                    formatter={(value) =>
                        !Number.isNaN(parseFloat(value))
                            ? `$ ${value}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
                            : '$ '
                    }
                    placeholder={"Enter expense"}
                    {...form.getInputProps('amount')}
                />
                <TextInput
                    placeholder={"Vendor"}
                    {...form.getInputProps('vendor')}
                />
                <CategoryPicker
                    onCategoryChange={handleCategoryChange}
                    {...form.getInputProps('category')}
                />
                <Radio.Group
                    name={"frequency"}
                    label={"Frequency"}
                    value={selectedFrequency}
                    onChange={(value) => {

                        setSelectedFrequency(value);
                        form.setFieldValue('is_monthly', value === 'monthly');
                        form.setFieldValue('is_yearly', value === 'yearly');
                    }}
                >
                    <Group mt={"xs"}>
                        <Radio value={"once"} label={"once"}/>
                        <Radio value={"monthly"} label={"monthly"}/>
                        <Radio value={"yearly"} label={"yearly"}/>
                    </Group>
                </Radio.Group>


                <Group
                    position={"center"}
                    mt={"md"}
                >
                    <Button
                        type={"submit"}
                        leftIcon={<FiPlus/>}
                        radius={"md"}
                        variant={"outline"}
                    >
                        Add new expense
                    </Button>
                </Group>
            </form>


        </div>
    )
}