"use client"
import IconPickerPopover from "@/components/IconPickerPopover";
import {Button} from "@/components/ui/button";

import { useAuth } from "@/app/context";

export default function Debug() {
    const {user, loading} = useAuth();

    return (
        <>
            <IconPickerPopover/>



        </>
    )
}

