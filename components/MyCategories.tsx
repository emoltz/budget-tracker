import {useEffect, useState} from "react";
import {useAuth} from "@/app/context";
import {User} from "firebase/auth";
import {getCategories} from "@/lib/firebase";
import {createStyles, Text, Card, RingProgress, Group, rem} from '@mantine/core';
import {Category} from "@/lib/Interfaces";


export default function MyCategories() {

    const {user, loading} = useAuth();
    const [categories, setCategories] = useState<Category[]>([]);

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


    const percentageSpent = (spent: number, budget: number) => {
        return Math.round(((spent / budget) * 100));
    }


    return (
        <>
            <div>My Categories:</div>

            <div>
                {categories.map((category: Category) => (
                    <Card

                        key={category.category_name}
                        withBorder
                        p="xl"
                        radius="md"
                    >

                        <Text>
                            {category.month}
                        </Text>
                        <Text>
                            {category.category_name}

                        </Text>
                        <Text>
                            ${category.budget}
                        </Text>
                        <Text>
                            Amount spent: ${category.spent}
                            <RingProgress
                                sections={[{value: percentageSpent(category.spent, category.budget), color: 'blue'}]}
                                thickness={6}
                                size={75}
                                label={
                                    <Text size="xs" align="center">
                                        {percentageSpent(category.spent, category.budget)}%
                                    </Text>
                                }
                            />
                        </Text>

                    </Card>
                ))}
            </div>
        </>
    )
}