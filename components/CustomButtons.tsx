"use client";
import React, {useState} from "react";
import {useDisclosure} from "@mantine/hooks";
import {
    Button,
    ColorPicker,
    ColorSwatch,
    DEFAULT_THEME,
    Input,
    Modal,
    NumberInput,
    Text,
    TextInput
} from "@mantine/core";
import {CategoryPicker} from "@/components/CategoryPicker";
import {Spacer} from "@nextui-org/react";
// import {ColorPicker} from "@/components/ColorPicker";
import {useForm} from "@mantine/form";
import {CustomButton} from "@/lib/Interfaces";
import {IconCheck, IconPencil, IconPlus} from "@tabler/icons-react";
import {icons} from "@/lib/icons";
import toast from "react-hot-toast";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,} from "@/components/ui/tooltip";

// TODO: add drag and drop functionality
const colorValueOffset: number = 4;
const colorMapping: { [key: string]: string } = {
    [DEFAULT_THEME.colors.red[DEFAULT_THEME.colors.red.length - colorValueOffset + 2]]: "red",
    [DEFAULT_THEME.colors.yellow[DEFAULT_THEME.colors.yellow.length - colorValueOffset]]: "yellow",
    [DEFAULT_THEME.colors.green[DEFAULT_THEME.colors.green.length - colorValueOffset]]: "green",
    [DEFAULT_THEME.colors.cyan[DEFAULT_THEME.colors.cyan.length - colorValueOffset]]: "cyan",
    [DEFAULT_THEME.colors.blue[DEFAULT_THEME.colors.blue.length - colorValueOffset]]: "blue",
    [DEFAULT_THEME.colors.violet[DEFAULT_THEME.colors.violet.length - colorValueOffset - 2]]: "violet",
    [DEFAULT_THEME.colors.pink[DEFAULT_THEME.colors.pink.length - colorValueOffset]]: "pink",
    [DEFAULT_THEME.colors.gray[DEFAULT_THEME.colors.gray.length - colorValueOffset]]: "gray",
};



const sampleButtons: CustomButton[] = [
    {
        iconName: "train",
        label: "Train",
        color: "cyan",
        action: {
            cost: 2.90,
            category: "Transportation"
        },

    },
    {
        iconName: "bell",
        label: "Lunch",
        color: "light",
        action: {
            cost: 15,
            category: "Food"
        },
    },
    {
        iconName: "beer",
        label: "Bar",
        color: "red",
        action: {
            cost: 20,
            category: "Activities"
        },
    },
    {
        iconName: "archive",
        label: "Work",
        color: "yellow",
        action: {
            cost: 0,
            category: "Work"
        },
    },
]


export const CustomButtons = () => {

    const [buttons, setButtons] = useState<CustomButton[]>(sampleButtons);
    const [opened, {open, close}] = useDisclosure(false);
    const [colorValue, setColorValue] = useState("#000000");
    const swatches: string[] = Object.keys(colorMapping);

    const form = useForm({
        initialValues: {
            label: "",
            color: "000000",
            // for actions:
            cost: 0,
            category: ""
        },

    });

    const generateSwatches = (selectedColor: any) => {
        return swatches.map((color) => {
            if (color === selectedColor) {
                return (
                    <div className="border-amber-950" style={{backgroundColor: color}}></div>
                );
            }
            return <div style={{backgroundColor: color}}></div>;
        });
    };
    return (
        <>

            <div
                className={"grid grid-cols-2 gap-2"}
            >
                {buttons.map((button, index) => (
                    <CustomButton
                        key={index}
                        customButton={button}
                        onClick={() => {
                            console.log(button.label, "$" + button.action.cost);
                            toast.success("Automation successful: " + button.label + " $" + button.action.cost)
                        }}
                    />


                ))}

            </div>
            <Spacer y={4}/>
            <div className={"flex justify-end gap-1"}>
                {/*EDIT*/}
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <div
                                className={"p-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 hover:shadow transition-all"}

                            >
                                <IconPencil size={20}/>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            Edit buttons
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                {/*ADD*/}
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <div

                                className={"p-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 hover:shadow transition-all"}
                                onClick={open}
                            >
                                <IconPlus size={20}/>
                            </div>

                        </TooltipTrigger>
                        <TooltipContent>
                            Add new button
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

            </div>

            {/*    ADD BUTTON MODAL */}
            <Modal
                opened={opened} onClose={close}
                className={"w-64"}
                title={"Add new button automation"}
                transitionProps={{
                    transition: 'rotate-left'
                }}
            >
                {/*    Add button form */}
                <div className={"sm:m-5 md:m-15 "}>

                    <form
                        onSubmit={form.onSubmit((values) => {
                            console.log("Form submitted:")
                            console.log(values);
                        })}
                        style={{
                            overflow: 'visible',
                        }}
                        className={"space-y-4"}

                    >
                        <TextInput
                            placeholder={"New button name"}
                            {...form.getInputProps('label')}
                        />
                        <CategoryPicker
                            onCategoryChange={
                                (category) => {
                                    form.getInputProps('category').onChange(category);
                                }
                            }
                            value={form.values.category}
                            dropdownPosition={"bottom"}
                        />
                        <div className={"flex transition-all gap-1"}>
                            {swatches.map((colorObj) => (
                                <CustomSwatch
                                    key={colorObj}
                                    color={colorObj}
                                    selectedColor={colorValue}
                                    onClick={(color:string ) => {
                                        setColorValue(color);
                                        const selectedColorName = colorMapping[color];
                                        form.getInputProps('color').onChange(selectedColorName);
                                    }}
                                />
                            ))}
                        </div>


                        <div className={"flex justify-end"}>


                            <Button
                                variant={"outline"}
                                compact
                                type={"submit"}
                            >
                                Submit
                            </Button>
                        </div>


                    </form>
                </div>


            </Modal>


        </>
    )
}

interface CustomButtonProps {
    customButton: CustomButton,
    onClick: () => void
}

const CustomButton = ({customButton, onClick}: CustomButtonProps) => {
    //   find icon
    const iconObject = icons.find(icon => icon.name === customButton.iconName);
    const IconComponent: React.JSX.Element | null = iconObject ? iconObject.component : null;


    return (
        <Button
            leftIcon={IconComponent}
            variant={"outline"}
            color={customButton.color}
            compact
            onClick={onClick}
        >
            {customButton.label}
        </Button>
    )
}

interface AddNewButtonProps {
    onClick: () => void
}

const AddNewButton = ({onClick}: AddNewButtonProps) => {
    const opened = true;
    return (
        <>
            <div
                style={{
                    paddingLeft: '200px'
                }}
            >

                <Modal
                    size={"xl"}
                    zIndex={1000}
                    opened={opened}
                    onClose={close}
                    title={"Add new button"}
                >
                    {/*    MODAL CONTENT*/}
                    <Text>
                        This allows you to create a button that will log a specific expense every time you push it.
                    </Text>
                    <Text>
                        Button Name:
                        <Input/>
                    </Text>

                    <Text>
                        Button Icon:

                    </Text>

                    <Text>
                        Button Color:
                        <ColorPicker/>

                    </Text>
                    <Text>
                        Expense Category:
                        <CategoryPicker
                            onCategoryChange={
                                (category) => console.log(category)
                            }

                        />
                    </Text>
                    <Text>
                        Price
                        <NumberInput

                            defaultValue={0}
                            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                            formatter={(value) =>
                                !Number.isNaN(parseFloat(value))
                                    ? `$ ${value}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
                                    : '$ '
                            }
                        />
                    </Text>
                    <Spacer y={1}/>
                    <Button
                        variant={"light"}
                        color={"cyan"}
                        onClick={close}>
                        Save
                    </Button>
                </Modal>
            </div>
        </>
    )
}


interface CustomSwatchProps {
    color: string,
    selectedColor: string,
    onClick: (color: string) => void
}

const CustomSwatch = ({color, selectedColor, onClick}: CustomSwatchProps) => {
    const isSelected = color === selectedColor;
    return (
        <ColorSwatch
            component={"button"}
            color={color}
            onClick={() => onClick(color)}
            sx={{ cursor:'pointer'}}
        >
            <div className={"text-white"}>

            {isSelected && <IconCheck size={20}/>}
            </div>
        </ColorSwatch>
    );
};

// const CustomSwatch = ({color, selectedColor, onClick}: CustomSwatchProps) => {
//     const isSelected = color === selectedColor;
//     return (
//         <div
//             onClick={() => onClick(color)}
//             style={{
//                 backgroundColor: color,
//                 width: 30,
//                 height: 30,
//                 margin: 5,
//                 cursor: 'pointer',
//                 border: isSelected ? '2px solid black' : 'none',
//                 boxSizing: 'border-box'
//             }}
//         />
//     );
// };