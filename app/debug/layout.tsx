"use client"
import {useMantineTheme} from "@mantine/core";

export default function layout({children}: never){
    const {colorScheme} = useMantineTheme();
    return (
        <div
            className={`${colorScheme == 'dark' ? "text-white" : ""}`}
        >
            {children}
        </div>
    )
}