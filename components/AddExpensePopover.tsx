import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {IconChevronDown, IconPlus} from "@tabler/icons-react";
import {Button, Input, NumberInput, useMantineColorScheme, useMantineTheme} from "@mantine/core";
import {useRef, useState} from "react";
import {CategoryPicker} from "@/components/CategoryPicker";
import toast from "react-hot-toast";

export default function AddExpensePopover() {
    const {colorScheme} = useMantineColorScheme();

    return (
        <>
            <div className={"flex"}>
                <Popover>
                    <PopoverTrigger>
                        <div
                            className="hover:shadow hover:bg-blue-400 w-[50px] rounded-l-2xl flex p-3 bg-blue-500 font-semibold text-white">
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

                        <button
                            className={"hover:shadow w-[30px] h-[48px] pl-1 pt-1 rounded-r-2xl bg-blue-500 hover:bg-blue-400 text-white"}
                        >
                            <IconChevronDown
                                size={20}
                            />
                        </button>
                    </PopoverTrigger>
                    <PopoverContent>
                        <div className={""}>
                            Buttons!
                        </div>
                    </PopoverContent>

                </Popover>
            </div>
        </>
    )
}

function AddExpenseForm() {
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

                            toast.success("Added expense: " + nameRef.current?.value)
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
