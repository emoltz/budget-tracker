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
    const user = useAuth();
    if (user) {
        // @ts-ignore
        return (
            <>
                Welcome {user.displayName}! You are logged in.
                {/*// @ts-ignore*/}
                <Button onClick={() => auth!.signOut()}>Sign out</Button>
            </>
        )
    } else {
        return (
            <Container
                my={"md"}
            >
                <SimpleGrid
                    cols={1}
                    spacing={"md"}
                    breakpoints={[{
                        maxWidth: 'sm',
                        cols: 1
                    }]}
                >


                    <LoginMantine/>
                </SimpleGrid>
            </Container>
        )
    }
}


