"use client";
import './globals.css';
import React, {useEffect, useState} from 'react';
import {getCategories, useCategories} from '@/lib/firebase';
import {collection, getDocs, getFirestore} from 'firebase/firestore';
import {useAuth} from "@/app/context";
import {User} from "firebase/auth";
import {
    Container,
    Button,
    Modal,
    Group,
    Grid,
    Text,
    SimpleGrid,
    Skeleton,
    useMantineTheme,
    Input,
    NumberInput,
    rem,
    Menu,
    Select,
    Paper, MultiSelect
} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import MyCategories from "@/components/MyCategories";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import {TwoColumnLayout} from "@/components/TwoColumnLayout";


import {
    FiPlus,
    FiActivity,
    FiAirplay,
    FiAlertCircle,
    FiAlertOctagon,
    FiAlertTriangle,
    FiAlignCenter,
    FiAlignJustify,

} from 'react-icons/fi';
import {
    FaTrain,
} from "react-icons/fa"
import {
    IconSettings,
    IconSearch,
    IconPhoto,
    IconMessageCircle,
    IconTrash,
    IconArrowsLeftRight
} from '@tabler/icons-react';
import {Spacer} from "@nextui-org/react";
import {Category} from "@/lib/Interfaces";
import LoginMantine from "@/components/LoginMantine";

const PRIMARY_COL_HEIGHT = rem(500);

export default function Home() {
    const theme = useMantineTheme();
    const SECONDARY_COL_HEIGHT = `calc(${PRIMARY_COL_HEIGHT} / 2 - ${theme.spacing.md} / 2)`;

    const user: User = useAuth();
    // if (!user) {
    //     // If there are any errors with hydration, this is the issue! Just comment out this `if` statement
    //     return <LoginMantine/>;
    // }

    return (
        <>
            <ThemeSwitcher/>
            <TwoColumnLayout
                leftComponent={<LeftColumn/>}
                rightComponent={<RightColumn/>}
            />


        </>
    )
}

const LeftColumn = () => {
    return (
        <Paper
            shadow={"sm"}
            p={"sm"}
            withBorder
            sx={{
                height: PRIMARY_COL_HEIGHT
            }}
        >
            <div className={"text-center items-center"}>
                <div className={"text-2xl"}>Actions</div>
                <Button
                    leftIcon={<FiPlus/>}
                    color={"dark"}
                    radius={"md"}
                    variant={"outline"}
                >
                    Add new expense


                </Button>
                <hr className="border-t border-gray-900 my-3.5"/>
                <CustomButtons/>


            </div>
        </Paper>
    )
}

const CustomButtons = () => {
    const [buttons, setButtons] = useState([]);
    const [opened, {open, close}] = useDisclosure(false);

    return (
        <>
            <div className={"text-2xl"}>
                Custom Buttons
            </div>
            {/*CUSTOM BUTTONS*/}
            <CustomButton
                icon={<FaTrain/>}
                label={"Train Ride"}
                color={"cyan"}
                onClick={() => console.log("clicked")}/>


            {/*ADD NEW BUTTON*/}
            <div>
                <Group
                    position={"center"}
                >
                    <Button
                        leftIcon={<FiPlus/>}
                        variant={"outline"}
                        color={"cyan"}
                        compact
                        onClick={open}
                    >
                        New Button
                    </Button>

                </Group>
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

interface CustomButtonProps {
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

const RightColumn = () => {
    return (
        <Paper
            shadow={"sm"}
            p={"sm"}
            withBorder
            sx={{
                height: PRIMARY_COL_HEIGHT
            }}
        >
            <div className={"text-center"}>
                <div className={"text-2xl"}>At a Glance</div>
            </div>

        </Paper>
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


const CategoryPicker = () => {
    const user = useAuth();
    // TODO fetch all categories from user
    const categories: Category[] = useCategories(user);
    // const data = userCategories.map((category) => category.category_name);
    // TODO add ability to create category from here!
    const data: string[] = categories ? categories.map((category) => category.category_name) : [];


    return (
        <Select data={data}
                placeholder={"Select a category"}
                maxDropdownHeight={160}
                transitionProps={{duration: 150, transition: 'pop-top-left', timingFunction: 'ease'}}
                dropdownComponent={"div"}
                searchable
                clearable
        />
    )
}