'use client';
import {Button} from '@mantine/core';
import LoginButton from "@/components/LoginButton";
import LoginMantine from "@/components/LoginMantine";
import {useAuth} from "@/app/context";
import {auth} from "@/lib/firebase";

import {
    Container,
    Grid,
    SimpleGrid,
    Skeleton,
    useMantineTheme,
    rem
} from '@mantine/core';

const PRIMARY_COL_HEIGHT = rem(300);

export default function Login() {
    const {user, loading} = useAuth();
    if (user) {
        return (
            <>
                {/* @ts-ignore */}
                Welcome {user.displayName}! You are logged in.

                {/*// @ts-ignore*/}
                <Button variant={"outline"}
                        onClick={() => auth!.signOut()}>Sign out</Button>
            </>
        )
    } else {
        return (
            <Container
                my={"md"}
            >
                <LoginMantine/>
            </Container>
        )
    }
}


