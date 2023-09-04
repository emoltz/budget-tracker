"use client"
import {Button, Input, NumberInput, useMantineTheme} from "@mantine/core";
import {useRef, useState} from "react";
import {CategoryPicker} from "@/components/CategoryPicker";
import {IconPlus} from "@tabler/icons-react";
import toast from "react-hot-toast";


export default function Debug() {

    return (
        <>
            <AddExpenseModal/>


        </>
    )
}

function AddExpenseModal() {
    const {colorScheme} = useMantineTheme();
    const darkModeClass = `${colorScheme == 'dark' ? "text-white" : ""} `
    const width = `w-[200px]`;
    const halfWidth = `w-[98px]`;
    const categoryRef = useRef("");
    const nameRef = useRef<HTMLInputElement>(null);
    const [category, setCategory] = useState("");

    const handleCategoryChange = (category: string) => {
        setCategory(category);
    }
    return (
        <>
            <div className={darkModeClass + " grid grid-cols-1 place-items-center space-y-1"}>
                <div className={"text-2xl font-bold p-3"}>
                    Add Expense
                </div>

                <div className={"flex justify-center w-full gap-1"}>
                    <Input
                        placeholder={"Name"}
                        className={halfWidth}
                        ref={nameRef}
                        onChange={() => {
                            console.log(nameRef.current?.value)
                        }}
                    />
                    <NumberInput
                        className={halfWidth}
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
                    />


                </div>
                <div className={width + " pb-3"}>
                    <CategoryPicker
                        value={category}

                        onCategoryChange={(category) => {
                            handleCategoryChange(category)
                            console.log(categoryRef.current)
                        }}

                    />
                </div>


                <Button
                    onClick={() => {
                        toast.success("Added expense: " + nameRef.current?.value)
                    }}
                    variant={"outline"}
                >
                    <IconPlus/>

                </Button>

            </div>
        </>
    )
}
