"use client";
import './globals.css';
import React, {useState} from 'react';
import {useAuth} from "@/app/context";
import {Button, Input, Modal, NumberInput, rem, Select, Text, useMantineTheme} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import {ThreeColumnLayout} from "@/components/layouts/ThreeColumnLayout";
import {CategoryPicker} from "@/components/CategoryPicker";

import {FiAlertCircle, FiPlus,} from 'react-icons/fi';
import {FaTrain,} from "react-icons/fa"
import {Spacer} from "@nextui-org/react";
import LoginMantine from "@/components/LoginMantine";
import AddNewExpense from "@/components/AddNewExpense";
import Loading from "@/app/loading";
import ComponentFrameCenter from "@/components/layouts/ComponentFrameCenter";
import BudgetCard from "@/components/BudgetCard";
import {useCategories} from "@/lib/firebase";
import {Category} from "@/lib/Interfaces";
import {User} from "firebase/auth";
import {icons} from "@/lib/icons";

const PRIMARY_COL_HEIGHT = rem(400);

export default function Home() {
    const theme = useMantineTheme();
    const SECONDARY_COL_HEIGHT = `calc(${PRIMARY_COL_HEIGHT} / 2 - ${theme.spacing.md} / 2)`;

    const {user, loading} = useAuth();
    if (loading) {
        return <Loading/>; // Or return a loading spinner
    }

    if (!user) {
        return <LoginMantine/>;
    }


    return (
        <>
            <ThreeColumnLayout
                two={<Actions/>}
                one={<CustomButtons/>}
                three={<AtAGlance
                    user={user}

                />}
            />
        </>
    )
}

const Actions = () => {
    return (
        <ComponentFrameCenter
            PRIMARY_COL_HEIGHT={PRIMARY_COL_HEIGHT}
            title={"Add New"}
        >
            <AddNewExpense/>
        </ComponentFrameCenter>
    )
}

const CustomButtons = () => {
    type Button = {
        icon: React.ReactNode,
        label: string,
        color: string,
        onClick: () => void
    }

    const [buttons, setButtons] = useState([]);
    const [opened, {open, close}] = useDisclosure(false);

    const sampleButtons: Button[] = [
        {
            icon: <FaTrain/>,
            label: "Train 1",
            color: "cyan",
            onClick: () => console.log("clicked")
        },
        {
            icon: <FiAlertCircle/>,
            label: "Lunch",
            color: "light",
            onClick: () => console.log("clicked")
        },
        {
            icon: <FaTrain/>,
            label: "Train 3",
            color: "red",
            onClick: () => {
                console.log("clicked");
            }
        },
    ]


    return (
        <>
            <ComponentFrameCenter
                PRIMARY_COL_HEIGHT={PRIMARY_COL_HEIGHT}
                title={"Custom Buttons"}
            >
                <div
                    className={"flex flex-wrap justify-center  space-x-1.5"}
                >
                    {sampleButtons.map((button, index) => (
                        <CustomButton
                            key={index}
                            icon={button.icon}
                            label={button.label}
                            color={button.color}
                            onClick={button.onClick}
                        />))}

                </div>
                {/*ADD NEW BUTTON*/}
                <div className={"p-2"}/>
                <div>
                    <Button
                        leftIcon={<FiPlus/>}
                        variant={"outline"}
                        compact
                        onClick={open}
                    >
                        New Button
                    </Button>
                </div>
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

            </ComponentFrameCenter>


        </>
    )
}

interface CustomButtonProps {
    key: number;
    icon: React.ReactNode;
    label: string;
    color: string;
    onClick: () => void;
}

const CustomButton = ({icon, label, color, onClick}: CustomButtonProps) => {
    return (
        <Button
            leftIcon={icon}
            variant={"outline"}
            color={color}
            compact
            onClick={onClick}
        >
            {label}
        </Button>
    )
}

interface AtAGlanceProps {
    user: User;
}

const AtAGlance = ({user}: AtAGlanceProps) => {
    const categories: Category[] = useCategories(user);


    return (
        <ComponentFrameCenter
            PRIMARY_COL_HEIGHT={"600px"}
            title={"At a Glance"}
        >
            <div
                className={"grid md:grid-cols-2 sm:grid-cols-1 gap-5"}
            >
                {categories.map((category, index) => {
                    const icon = icons.find(icon => icon.name === category.iconName);
                    let name = category.iconName;
                    if (!icon) {
                        name = "dashboard";
                    } else {
                        name = icon.name;
                    }
                    return (
                        <BudgetCard
                            key={index}
                            id={category.id}
                            budgetName={category.category_name}
                            budgetAmount={category.budget}
                            spent={category.spent}
                            iconName={category.iconName ? name : "dashboard"}
                        />
                    )
                })}
            </div>
        </ComponentFrameCenter>
    )
}

const ColorPicker = () => {
    const data = [
        // colors
        {value: 'cyan', label: 'Cyan'},
        {value: 'blue', label: 'Blue'},
        {value: 'gray', label: 'Gray'},
        {value: 'red', label: 'Red'},
        {value: 'yellow', label: 'Yellow'},
        {value: 'teal', label: 'Teal'},
        {value: 'indigo', label: 'Indigo'},
        {value: 'green', label: 'Green'},
        {value: 'pink', label: 'Pink'},
        {value: 'purple', label: 'Purple'},
        //TODO put actual thumbnails with colors also (see Mantine documentation)
    ]

    return (
        <Select data={data}
                placeholder={"Select a Color"}
                maxDropdownHeight={100}
                transitionProps={{duration: 150, transition: 'pop-top-left', timingFunction: 'ease'}}
                dropdownComponent={"div"}
                searchable
                clearable

                nothingFound={"We can't do that color :("}
        />
    )

}


