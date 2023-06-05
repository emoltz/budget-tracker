'use client';
import {Button} from 'antd';
import LoginButton from "@/components/LoginButton";
import {useAuth} from "@/app/context";
import {useContext} from "react";
// @ts-ignore
import {auth} from "@/lib/firebase";

export default function Login() {
    const user = useAuth();
    if (user) {
        // @ts-ignore
        return (
            <>
                Welcome! You are logged in.
                {/*// @ts-ignore*/}
                <Button onClick={() => auth.signOut()}>Sign out</Button>
            </>
        )
    }
    else{
        return (
            <>
                <LoginButton />
            </>
        )
    }
}


