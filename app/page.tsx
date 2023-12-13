"use client";
import './globals.css';
import React from 'react';
import {useAuth} from "@/app/context";
import {rem,} from '@mantine/core';
import {useRouter} from 'next/navigation';

import {Flex, Stack, Title, Text, Button, Dialog, Anchor, useMantineColorScheme} from "@mantine/core";
import {useDisclosure} from '@mantine/hooks';
import LoginMantine from "@/components/LoginMantine";

const PRIMARY_COL_HEIGHT = rem(400);

export default function Home() {
    const {user, loading} = useAuth();
    const [opened, { open, close }] = useDisclosure(true);
    const {colorScheme} = useMantineColorScheme();

    const router = useRouter();
    if (user) {
        return router.push('/dashboard')
    }
     // let userCookie = hasCookie("user");
    // if (userCookie === false) {
    //     open();  
    // }

    // if (hasCookie("user") === false) {
    //     open();
    // }

    return (
        <>
            <Flex align="center" className="gap-10 p-20">
                <Stack align="center" className="w-1/2 p-10">
                    <Title className={`${colorScheme == 'dark'? "text-amber-50" : ""}`}>Welcome to Argonaut</Title>
                    <Text className={`${colorScheme == 'dark'? "text-white" : ""}`}>
                        This is where a short blurb would go about what Argonaut is. We can also include information about who we are and include links to our GitHub profiles.
                    </Text >
                    <Text className={`${colorScheme == 'dark'? "text-white" : ""}`}>
                        To see how Argonaut works, try a quick demo.
                    </Text>
                    <Button variant="outline">Get Started</Button>
                </Stack>
                <LoginMantine/>
            </Flex>
            {/* <Dialog opened={opened} withCloseButton onClose={close} size="lg" radius="md">
                <Text size="sm" mb="xs" fw={500}>
                    Welcome to Argonaut! Would you like a quick tour?
                </Text>
                <Flex align="flex-end">
                    <Button onClick={close} variant='outline'>Try it</Button>
                    <Anchor
                        component="button"
                        type="button"
                        color="dimmed"
                        onClick={close}
                        size="xs"
                    >
                        No thanks
                    </Anchor>
                </Flex>
            </Dialog> */}
    </>
    )
}
