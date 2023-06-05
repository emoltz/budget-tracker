'use client';
import { useEffect } from 'react';
import {Button} from 'antd';
// @ts-ignore
import {auth} from "@/lib/firebase";
import {GoogleAuthProvider, signInWithPopup} from "firebase/auth";

export default function LoginButton(){
    const signInWithGoogle = async () => {
        // @ts-ignore
        if (typeof window !== 'undefined' && auth) {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            // TODO send to backend too
        }
    }

    return (
        <Button
            onClick={signInWithGoogle}
        >
            Signin with Google
        </Button>
    )
}
