'use client';
import {Button} from 'antd';
import LoginButton from "@/components/LoginButton";
import {UserContext} from "@/lib/context";
import {useContext} from "react";
import {auth} from "@/lib/firebase";

export default function Login() {

    return (
        <>
          <LoginButton/>
        </>
    )
}


