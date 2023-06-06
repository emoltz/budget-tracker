'use client';
import { useEffect } from 'react';
import {Button} from 'antd';
// @ts-ignore
import {auth, saveUserToDatabase} from "@/lib/firebase";
import {GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import GoogleButton from "react-google-button";

export default function LoginButton(){
    const signInWithGoogle = async () => {
        // @ts-ignore
        if (typeof window !== 'undefined' && auth) {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            if (user){
                await saveUserToDatabase(user);
            }
        }
    }

    return (
        <GoogleButton
            onClick={signInWithGoogle}
        />

    )
}
