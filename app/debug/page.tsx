"use client"
import IconPickerPopover from "@/components/IconPickerPopover";

import { useAuth } from "@/app/context";
import { migrateExpenses } from "@/lib/firebase";

export default function Debug() {
    const {user, loading} = useAuth();

    return (
        <>
            <IconPickerPopover/>


            <Button variant={"outline"} color="red" onClick={() => {
                if (user)
                    migrateExpenses(user);
                }}>
                Migrate Expenses
            </Button>

        </>
    )
}

