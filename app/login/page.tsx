'use client';
import {Button} from '@mantine/core';
import LoginButton from "@/components/LoginButton";
import {useAuth} from "@/app/context";
// @ts-ignore
import {auth} from "@/lib/firebase";

export default function Login() {
    const user = useAuth();
    if (user) {
        // @ts-ignore
        return (
            <>
                Welcome {user.displayName}! You are logged in.
                {/*// @ts-ignore*/}
                <Button onClick={() => auth.signOut()}>Sign out</Button>
            </>
        )
    }
    else{
        return (
            <>
                Login Here
                {/*<LoginButton />*/}
            </>
        )
    }
}


