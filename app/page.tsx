"use client";
import './globals.css';
import {useEffect, useState} from 'react';
import {getCategories} from '@/lib/firebase';
import {collection, getDocs, getFirestore} from 'firebase/firestore';
import {useAuth} from "@/app/context";
import {User} from "firebase/auth";
import {Container, Button, Grid, SimpleGrid, Skeleton, useMantineTheme, rem} from '@mantine/core';

const PRIMARY_COL_HEIGHT = rem(300);

export default function Home() {
    const theme = useMantineTheme();
    const SECONDARY_COL_HEIGHT = `calc(${PRIMARY_COL_HEIGHT} / 2 - ${theme.spacing.md} / 2)`;

    const user: User = useAuth();
    const [categories, setCategories] = useState<string[]>([]);

    useEffect(() => {
        const data = async () => {
            if (user) {
                return await getCategories(user);
            }
            return [];
        }
        data().then((data) => {
            setCategories(data!);
        });
    }, [user])


    return (
        <>
            <h2>Your Categories:</h2>
            <div>
                {categories.map((category, index) => (
                    <div key={index}>{category}</div>
                ))}
            </div>

            <Container my="md">
                <SimpleGrid cols={2} spacing="md" breakpoints={[{maxWidth: 'sm', cols: 1}]}>
                    <Skeleton height={PRIMARY_COL_HEIGHT} radius="md" animate={false}/>
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
