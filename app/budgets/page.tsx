"use client";
import React, {useState} from "react";
import {useAuth} from "@/app/context";
import {Category, CategoryClass, MonthSummary} from "@/lib/Interfaces";
import { useCategories, useSummary } from "@/lib/firebase";

import {Button, Modal, NumberInput, TextInput,} from "@mantine/core";
import {useDisclosure} from "@mantine/hooks";
import {useForm} from "@mantine/form";
import {icons} from "@/lib/icons";
import {FiPlus} from "react-icons/fi";

import ComponentFrameCenter from "@/components/layouts/ComponentFrameCenter";
import LoadingAtAGlance from "@/components/layouts/LoadingAtAGlance";
import BudgetCardAdd from "@/components/BudgetCardAdd";

export default function Budgets() {
    const { user, loading } = useAuth();
    const [opened, { open, close }] = useDisclosure(false);
    const icon = icons.find((icon) => icon.name === "dashboard");
    const [selectedIcon, setSelectedIcon] = useState(icon);

    const budgets: Category[] | null =
        useCategories(user);

    const summary: MonthSummary | undefined = useSummary(user);
    const form = useForm({
        initialValues: {
            categoryName: "",
            budgetAmount: 0,
            spent: 0,
            icon: "",
        },
    });

    if (loading) {
        return <div>Loading...</div>;
    }

    const handleIconSelect = (iconId: string) => {
        const selectedIcon = icons.find((icon) => icon.name === iconId);
        setSelectedIcon(selectedIcon);
    };

    // TODO: Figure out how to get this connected to the backend properly
    const handleSaveNewCategoryBudget = () => {
        // console.log("Save new category/budget");
        // const categoryBudget: CategoryBudget = {
        //     category: "Brand New Category",
        //     budgetAmount: 500,
        //     spent: 0,
        //     icon: selectedIcon?.name || "dashboard",
        // };
        // console.log("category budget", categoryBudget);
        // addBudget(user, categoryBudget, false);
        // close();
    };

    interface AtAGlanceProps {
        budgets: Category[] | null;
        summary: MonthSummary | undefined;
    }

    const AtAGlance = ({ budgets, summary }: AtAGlanceProps) => {
        return (
            <>
                <ComponentFrameCenter
                    PRIMARY_COL_HEIGHT={"600px"}
                    title={"Add New Budgets/Categories"}
                >
                    <div className={"grid md:grid-cols-2 sm:grid-cols-1 gap-5"}>
                        {budgets ? (
                            budgets.map((category: Category, idx: number) => {
                                return (
                                    <BudgetCardAdd
                                        key={idx}
                                        id={idx.toString()}
                                        budgetName={category.name}
                                        budgetAmount={category.amount}
                                        spent={summary?.categoryTotals[category.name] || 0}
                                        iconName={category.icon}
                                    />
                                );
                            })
                        ) : (
                            <LoadingAtAGlance />
                        )}
                    </div>
                </ComponentFrameCenter>
            </>
        );
    };

    return (
        <>
            <AtAGlance
                // userData={userData}
                // user={user}
                budgets={budgets}
                summary={summary}
            />
            {/* <ul className={"p-3"}>
                {categoryObject.map((category: CategoryBudget) => (
                    <li className={"my-3"} key={category.category}>
                        <BudgetByCategory category_name={category.category} />
                    </li>
                ))}
            </ul> */}

            <Button
                leftIcon={<FiPlus />}
                variant={"outline"}
                color={"dark"}
                compact
                onClick={open}
            >
                New Category
            </Button>

            <Button variant={"outline"}>Save all Changes</Button>

            <Modal
                size={"lg"}
                zIndex={2}
                opened={opened}
                onClose={close}
                title="Add New Budget Category"
                centered
            >
                {/* Modal content */}
                <form
                    onSubmit={form.onSubmit((values) => {
                        console.log("Form submitted");
                        const newCategoryBudget: CategoryClass = new CategoryClass(
                            values.categoryName,
                            values.icon ? values.icon : "dashboard",
                            values.budgetAmount,
                            false
                        );
                        console.log(newCategoryBudget)
                        // add budget to firebase
                        // addCategory(user, newCategoryBudget, false);

                        // OLD 
                        // const newCategoryBudget: CategoryBudget = {
                        //     name: values.categoryName,
                        //     amount: values.budgetAmount,
                        //     spent: 0,
                        //     icon: values.icon ? values.icon : "dashboard",
                        // };
                    })}
                    style={{
                        overflow: "visible",
                    }}
                    className={"space-y-4"}
                >
                    <div className={"flex gap-3 justify-center"}></div>

                    <TextInput
                        withAsterisk
                        label="categoryName"
                        placeholder="New Category Name"
                        {...form.getInputProps("categoryName")}
                    />

                    <NumberInput
                        withAsterisk
                        label="budgetAmount"
                        placeholder="New Budget Amount"
                        hideControls
                        {...form.getInputProps("budgetAmount")}
                    />

                    <Button variant={"outline"} type="submit" onClick={close}>
                        Submit
                    </Button>
                </form>
                {/* <Text>
                    This allows you to create a new budget category and assign it a budget
                    for the month.
                </Text>

                <Text>
                    Category Name:
                    <Input />
                </Text>
                <Spacer y={1} />
                <Text>Select an Icon:</Text>
                <IconPickerPopover></IconPickerPopover>
                <Text>
                    Budget Amount:
                    <Input type="number" placeholder="500" />
                </Text>

                <Spacer y={1} />
                <Button
                    variant={"light"}
                    color={"cyan"}
                    onClick={handleSaveNewCategoryBudget}
                >
                    Save new Category/Budget
                </Button> */}
            </Modal>
        </>
    );
}
