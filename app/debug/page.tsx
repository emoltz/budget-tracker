"use client"
import {useEffect, useState} from "react";
import {getExpenses} from "@/lib/firebase";
import {useAuth} from "@/app/context";

export default function Debug() {
    const [expenses, setExpenses] = useState<any[]>();
    const {user, loading} = useAuth();

    useEffect( () => {
        const getUserExpenses = async () => {
            const res = await getExpenses(user);
            setExpenses(res);
        }
        getUserExpenses().then(r => console.log(expenses));
    }, [user])
    return(
        <>
            {user?.uid}
        </>
    )
}
