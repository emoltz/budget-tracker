"use client"
import {Paper} from "@mantine/core";
import React, {useEffect, useState} from "react";

interface Props {
    PRIMARY_COL_HEIGHT: string;
    title?: string;
    width?: string;
    children: React.ReactNode;
}

export default function ComponentFrameCenter({PRIMARY_COL_HEIGHT, title, width, children}: Props) {
    const [screenWidth, setScreenWidth] = useState<number | null>(null);
    useEffect(() => {
        // Check if the current screen width indicates a mobile device
        if (window.innerWidth <= 768) {
            setScreenWidth(window.innerWidth);
        }

        // Optional: Add a resize event listener to update the width if the window is resized
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setScreenWidth(window.innerWidth);
            } else {
                setScreenWidth(null);
            }
        };
        window.addEventListener('resize', handleResize);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    return (
        <Paper
            shadow={"sm"}
            p={"sm"}
            withBorder
            sx={{
                height: PRIMARY_COL_HEIGHT,
                width: width ? width : (screenWidth ? `${screenWidth}px` : 'auto'),

                overflowY: "auto",
                overflowX: "auto"
            }}
        >
            <div className={"text-center items-center max-w-2xl"}>
                <div className={"text-2xl p-1"}>
                    <div className={"p-2"}>
                        {title ? title : ""}
                    </div>
                </div>
                {children}
            </div>
        </Paper>
    )

}