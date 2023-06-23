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

const PRIMARY_COL_HEIGHT = rem(300);

export default function Home() {
    const theme = useMantineTheme();
    const SECONDARY_COL_HEIGHT = `calc(${PRIMARY_COL_HEIGHT} / 2 - ${theme.spacing.md} / 2)`;

    const user: User = useAuth();

    return (
        <>
            <Container my="md">
                <SimpleGrid cols={2} spacing="md" breakpoints={[{maxWidth: 'sm', cols: 1}]}>

                    <div>


                    </div>

                    <Grid gutter="md">
                        <Grid.Col>
                            <Skeleton height={SECONDARY_COL_HEIGHT} radius="md" animate={false}/>

                        </Grid.Col>
                        <Grid.Col span={6}>
                            <Skeleton height={SECONDARY_COL_HEIGHT} radius="md" animate={false}/>
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <Skeleton height={SECONDARY_COL_HEIGHT} radius="md" animate={false}/>
                        </Grid.Col>
                    </Grid>
                </SimpleGrid>
            </Container>

        </>
    )
}
