import {IconPlus} from "@tabler/icons-react";
import {Button} from "./button";
import React from "react";
import {StringToBoolean} from "class-variance-authority/dist/types";

interface AddButtonProps {
    size?: StringToBoolean<keyof { default: string; icon: string; sm: string; lg: string }> | null | undefined
    onClick: () => void
}

export default function AddButton({ size, onClick }: AddButtonProps) {
    return (
        <Button
            className={"mr-3"}
            variant={"secondary"}
            size={size}
            onClick={onClick}
        >
            <IconPlus/>
        </Button>
    )
}