"use client";
import './globals.css';
import {useEffect, useState} from 'react';
import {getCategories} from '@/lib/firebase';
import {collection, getDocs, getFirestore} from 'firebase/firestore';
import {useAuth} from "@/app/context";
import {User} from "firebase/auth";
import {Container, Button, Grid, SimpleGrid, Skeleton, useMantineTheme, rem} from '@mantine/core';
import MyCategories from "@/components/MyCategories";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import {TwoColumnLayout} from "@/components/TwoColumnLayout";

const PRIMARY_COL_HEIGHT = rem(300);

export default function Home() {
    const theme = useMantineTheme();
    const SECONDARY_COL_HEIGHT = `calc(${PRIMARY_COL_HEIGHT} / 2 - ${theme.spacing.md} / 2)`;

    const user: User = useAuth();

    return (
        <>
            <TwoColumnLayout
                leftComponent={<LeftColumn/>}
                rightComponent={<RightColumn/>}
            />


        </>
    )
}

const LeftColumn = () => {
    return (
        <>
            Left Column
        </>
    )
}

const RightColumn = () => {
    return (
        <>
            Right Column
        </>
    )
}
