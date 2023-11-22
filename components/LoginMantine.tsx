"use client";
import {upperFirst, useToggle, useDisclosure} from '@mantine/hooks';
import {useForm} from '@mantine/form';
import {
    Anchor,
    Button,
    Checkbox,
    Divider,
    Group,
    Paper,
    PaperProps,
    PasswordInput,
    Stack,
    Text,
    TextInput,
    Dialog,
} from '@mantine/core';
import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInWithPopup,
    updateProfile,
    User,
    UserCredential,
    sendPasswordResetEmail,
    getAuth
} from "firebase/auth";
import {auth, saveUserToDatabase} from "@/lib/firebase";
import GoogleButton from "react-google-button";
import {doc, getDoc, getFirestore} from "firebase/firestore";
import React from "react";


export default function LoginMantine(props: PaperProps) {
    // GOOGLE

    const signInWithGoogle = async (): Promise<void> => {
        if (typeof window !== 'undefined' && auth!) {
            const provider: GoogleAuthProvider = new GoogleAuthProvider();
            const result: UserCredential = await signInWithPopup(auth, provider);
            const user: User = result.user;
            if (user) {
                const db = getFirestore();
                const userDocRef = doc(db, "Users", user.uid);
                const userDocSnap = await getDoc(userDocRef);
                if (!userDocSnap.exists()) {
                    // The user does not exist in the database, save the user
                    await saveUserToDatabase(user);
                }
            }
        }
    }
    //COMPONENT
    const [type, toggle] = useToggle(['login', 'register']);
    const [opened, { open, close }] = useDisclosure(false);
    const form = useForm({
        initialValues: {
            email: '',
            name: '',
            password: '',
            terms: true,
        },
        validate: {
            email: (val: string) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
            password: (val: string) => (val.length <= 6 ? 'Password should include at least 6 characters' : null),
        }
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(form.values);
        const email = form.values.email;
        const password = form.values.password;
        const name = form.values.name;
        try {
            if (type == 'register') {
                await createUserWithEmailAndPassword(auth!, email, password).then(() => {
                    console.log("registered!");
                });
                if (auth?.currentUser) {
                    await updateProfile(auth.currentUser, {
                        displayName: name
                    });

                    await saveUserToDatabase(auth.currentUser).then(() => {
                        console.log("User successfully sent to database!");
                        console.log(auth.currentUser)
                    });
                } else {
                    console.error("No authenticated user found");
                }
            } else {
                await signInWithEmailAndPassword(auth!, email, password).then(() => {
                    console.log("logged in!");
                }).catch((error) => {
                    alert('Error logging in');
                });
            }
        } catch (error) {
            console.warn(error);
        }
    }


    return (
        <Paper
            radius={"md"}
            p={"xl"}
            withBorder
            {...props}
        >

            <Text
                size={"lg"}
                weight={500}
            >
                Welcome, {type} with
            </Text>
            <Group
                grow
                mb={"md"}
                mt={"md"}
            >
                <GoogleButton onClick={signInWithGoogle}/>
            </Group>
            <Divider
                label={"Or continue with email"}
                labelPosition={"center"}
                my={"lg"}
            />
            <form onSubmit={handleSubmit}>
                <Stack>
                    {type == 'register' && (
                        <TextInput
                            label={"Name"}
                            placeholder={"Your name"}
                            value={form.values.name}
                            onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
                            radius={"md"}
                        />
                    )}
                    <TextInput
                        required
                        label={"Email"}
                        placeholder={"hello@you.com"}
                        value={form.values.email}
                        onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
                        error={form.errors.email && 'Invalid Email'}
                        radius={"md"}
                    />
                    <PasswordInput
                        required
                        label="Password"
                        placeholder="Your password"
                        value={form.values.password}
                        onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
                        error={form.errors.password && 'Password should include at least 6 characters'}
                        radius="md"
                    /> {type === 'register' && (
                    <Checkbox
                        label="I accept terms and conditions"
                        checked={form.values.terms}
                        onChange={(event) => form.setFieldValue('terms', event.currentTarget.checked)}
                    />
                )}
                </Stack>
                <Group position="apart" mt="xl">
                    <Anchor
                        component="button"
                        type="button"
                        color="dimmed"
                        onClick={() => toggle()}
                        size="s"
                    >
                        {type === 'register'
                            ? 'Already have an account? Login'
                            : "Don't have an account? Register"}
                    </Anchor>

                    {
                        type === 'login' && 
                            <Anchor
                                component="button"
                                type="button"
                                color="dimmed"
                                onClick={open} // Open Forgot Dialog 
                                size="s"
                                >
                                Forgot Password?
                            </Anchor> 
                    }
                    <ForgotPasswordForm opened={opened} close={close}></ForgotPasswordForm>
                    
                    <Button variant={"outline"} type="submit" radius="xl">
                        {upperFirst(type)}
                    </Button>

                </Group>
            </form>
        </Paper>
    )
}

interface PasswordFormProps {
    opened: boolean,
    close: () => void

}

function ForgotPasswordForm({ opened, close } : PasswordFormProps) {

    const form = useForm({
        initialValues: {
            email: ''
        },
        validate: {
            email: (val: string) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
        }
    });

    return (
        <Dialog opened={opened} withCloseButton onClose={close} size="lg" radius="md">
            <Text size="sm" mb="xs" fw={500}>Enter Your Email</Text>

            <form onSubmit={() => {sendPasswordResetEmail(getAuth(), form.values.email)
                            .then(() => {
                                // Password reset email sent!
                                alert("Please check your email for instructions to reset your password.");
                            })
                            .catch((error) => {
                                const errorCode = error.code;
                                const errorMessage = error.message;
                                console.log("Error code: " + errorCode);
                            });}}>
                <Group align="flex-end">
                    <TextInput 
                        placeholder="hello@gluesticker.com" 
                        style={{ flex: 1 }} 
                        {...form.getInputProps('email')}
                    />
                    <Button variant={"outline"} type='submit'>Reset Password</Button>
                </Group>
            </form>
        </Dialog>
    )
}