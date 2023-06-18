"use client";
import {useEffect, useState} from 'react';
import {Button} from "@mantine/core";
import {getCategories} from '@/lib/firebase';
import {collection, getDocs, getFirestore} from 'firebase/firestore';
import {useAuth} from "@/app/context";
import {User} from "firebase/auth";


export default function Home() {
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
        </>
    )
}
