'use client';
import {ReactElement, useState} from 'react';
import {Button, Checkbox, Form, Input} from 'antd';

import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInWithPopup
} from "firebase/auth";
// @ts-ignore
import {auth, saveUserToDatabase_depricated} from "@/lib/firebase";
import GoogleButton from "react-google-button";
import {Spacer} from "@nextui-org/react";

export default function LoginButton(): ReactElement {
    const signInWithGoogle = async () => {
        // @ts-ignore
        if (typeof window !== 'undefined' && auth) {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider) as any;
            const user = result.user;
            const isNewUser = result.additionalUserInfo?.isNewUser;
            if (user && isNewUser) {
                await saveUserToDatabase_depricated(user);
            }
        }
    }

    // Signin with email/password
    type AuthData = {
        email: string,
        password: string
    };
    const [isRegisterMode, setIsRegisterMode] = useState(false);

    const signInWithEmail = async (e: AuthData) => {

        const {email, password} = e;

        try {
            if (isRegisterMode) {
                // @ts-ignore
                await createUserWithEmailAndPassword(auth, email, password).then(() => {
                    console.log("registered!");
                });
                // @ts-ignore
                await saveUserToDatabase_depricated(auth.currentUser).then(() => {
                    console.log("User successfully sent to database!");
                });

            } else {
                // @ts-ignore
                await signInWithEmailAndPassword(auth, email, password);

            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        //  getting a hydration error here... not sure why. I think it's because I'm using the antd form.
        <>
            <Form
                name="auth"
                labelCol={{span: 8}}
                wrapperCol={{span: 16}}
                initialValues={{remember: true}}
                autoComplete="off"
                onFinish={signInWithEmail}
            >
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{required: true, message: 'Please input your email'}]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{required: true, message: 'Please input your password'}]}
                >
                    <Input.Password/>
                </Form.Item>
                <Form.Item name="remember" valuePropName="checked" wrapperCol={{offset: 8, span: 16}}>
                    <Checkbox>Remember me</Checkbox>
                </Form.Item>
                <Form.Item wrapperCol={{offset: 8, span: 16}}>
                    <Button type="primary" htmlType="submit">
                        {isRegisterMode ? 'Register' : 'Sign In'}
                    </Button>
                    <Button type="link" onClick={() => setIsRegisterMode(!isRegisterMode)}>
                        {isRegisterMode ? 'Already have an account? Sign In' : 'Don’t have an account? Register'}
                    </Button>
                </Form.Item>
            </Form>
            <Button>
                Sign up with email
            </Button>
            <Spacer y={.5}/>

            <GoogleButton
                onClick={signInWithGoogle}
            />
        </>

    )
}

