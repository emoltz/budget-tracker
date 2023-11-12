import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {IconChevronDown, IconPlus} from "@tabler/icons-react";
import {Button, Input, NumberInput, useMantineColorScheme, useMantineTheme} from "@mantine/core";
import {useRef, useState} from "react";
import {CategoryPicker} from "@/components/CategoryPicker";
import toast from "react-hot-toast";
import {CustomButtons} from "@/components/CustomButtons";
import {ExpenseClass} from "@/lib/Interfaces";
import {addOrUpdateExpense} from "@/lib/firebase";
import {useAuth} from "@/app/context";

interface AddExpensePopoverProps {
    heightClass?: string
}

export default function AddExpensePopover({heightClass}: AddExpensePopoverProps) {
    const {colorScheme} = useMantineColorScheme();
    const height = heightClass ? heightClass : `h-[48px]`;
    return (
        <>
            <div className={"flex"}>
                <Popover>
                    <PopoverTrigger>
                        <div
                            className={`${height} + w-[50px] hover:shadow hover:bg-blue-400 rounded-l-2xl  p-3 bg-blue-500 font-semibold text-white`}
                        >
                            New

                        </div>

                    </PopoverTrigger>
                    <PopoverContent
                        className={`${colorScheme == 'dark' ? "bg-black border-gray-700 shadow-2xl" : ""} `}
                    >
                        <AddExpenseForm/>
                    </PopoverContent>
                </Popover>


                <Popover>
                    <PopoverTrigger>

                        <div
                            className={`${height} + hover:shadow w-[30px]  pl-1 rounded-r-2xl bg-blue-500 hover:bg-blue-400 text-white pt-3.5`}
                        >
                            <IconChevronDown
                                size={20}
                            />
                        </div>
                    </PopoverTrigger>
                    <PopoverContent>

                        <CustomButtons/>

                    </PopoverContent>

                </Popover>
            </div>
        </>
    )
}

function AddExpenseForm() {
    const {user} = useAuth();
    const {colorScheme} = useMantineTheme();
    const darkModeClass = `${colorScheme == 'dark' ? "text-white" : ""} `
    const width = `w-[200px]`;
    const halfWidth = `w-[98px]`;
    const categoryRef = useRef("");
    const nameRef = useRef<HTMLInputElement>(null);
    const priceRef = useRef<HTMLInputElement>(null);
    const [category, setCategory] = useState("");

    const handleCategoryChange = (category: string) => {
        setCategory(category);
    }
    return (
        <>
            <div className={darkModeClass + " grid grid-cols-1 place-items-center space-y-1"}>

                <div className={"flex justify-center w-full gap-1"}>
                    <Input
                        placeholder={"Name"}
                        className={halfWidth}
                        ref={nameRef}
                        // onChange={() => {
                        //     console.log(nameRef.current?.value)
                        // }}
                    />
                    <NumberInput
                        className={halfWidth}
                        defaultValue={0.00}
                        ref={priceRef}
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


                <div className={""}>
                    <Button
                        onClick={() => {
                            if (nameRef.current?.value == "") {
                                toast.error("Please enter a name")
                                return;
                            }
                            if (category == "") {
                                toast.error("Please choose a category")
                                return;
                            }

                            toast.success("Added expense: " + priceRef.current?.value + " to " + category)

                            // first, make expense class
                            const priceString = priceRef.current?.value.replace(/\$|,/g, ''); // Remove the dollar sign and comma
                            const price = priceString ? parseFloat(priceString) : 0;
                            // console.log("Price: ", price)

                            // TODO: way to have default date (today) as ExpenseClass default?
                            const today = new Date();
                            const expense = new ExpenseClass(nameRef.current!.value, category, price, "", "", today.getMonth() + 1, today.getFullYear())
                            addOrUpdateExpense(user, expense).then(() => {
                                console.log("Expense added: ", expense)
                            })

                        }}
                        variant={"outline"}
                    >
                        <IconPlus/>

                    </Button>
                </div>
            </div>
        </>
    )
}
