"use client";
import {upperFirst, useToggle} from '@mantine/hooks';
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
} from '@mantine/core';
import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInWithPopup,
    updateProfile,
    User,
    UserCredential
} from "firebase/auth";
// @ts-ignore
import {auth, saveUserToDatabase} from "@/lib/firebase";
import GoogleButton from "react-google-button";
import {doc, getDoc, getFirestore} from "firebase/firestore";

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
                        size="xs"
                    >
                        {type === 'register'
                            ? 'Already have an account? Login'
                            : "Don't have an account? Register"}
                    </Anchor>
                    <Button variant={"outline"} type="submit" radius="xl">
                        {upperFirst(type)}
                    </Button>
                </Group>
            </form>
        </Paper>
    )
}