"use client";
import './globals.css';
import React, {useEffect, useState} from 'react';
import {getCategories} from '@/lib/firebase';
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
    rem,
    Paper
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

const PRIMARY_COL_HEIGHT = rem(500);

export default function Home() {
    const theme = useMantineTheme();
    const SECONDARY_COL_HEIGHT = `calc(${PRIMARY_COL_HEIGHT} / 2 - ${theme.spacing.md} / 2)`;

    const user: User = useAuth();

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
            <Modal
                opened={opened}
                onClose={close}
                title={"Add new button"}
            >
                {/*    MODAL CONTENT*/}
                <div>
                    Button Name:

                </div>
                <div>
                    Button Icon:

                </div>
                <div>
                    Button Color:
                </div>
                <div>
                    Expense Category:
                </div>
                <div>
                    Expense Amount:
                </div>
            </Modal>


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
