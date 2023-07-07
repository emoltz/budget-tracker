import {Paper} from "@mantine/core";
import React from "react";

interface Props {
    PRIMARY_COL_HEIGHT: string;
    title: string;
    children: React.ReactNode;
}

export default function ComponentFrameCenter({PRIMARY_COL_HEIGHT, title, children}: Props){

    return(
        <Paper
            shadow={"sm"}
            p={"sm"}
            withBorder
            sx={{
                height: PRIMARY_COL_HEIGHT
            }}
        >
            <div className={"text-center items-center"}>
                <div className={"text-2xl p-1"}>
                    <div className={"p-2"}>
                        {title}
                    </div>
                </div>
                {children}
            </div>
        </Paper>
    )

}