"use client"
import {Button} from "@/components/ui/button";

import { useAuth } from "@/app/context";
import { migrateExpenses } from "@/lib/firebase";

export default function Debug() {
    const {user, loading} = useAuth();

    return (
        <>
            <Button>
                Hello
            </Button>

            <Button variant={"outline"} color="red" onClick={() => {
                if (user)
                    migrateExpenses(user);
                }}>
                Migrate Expenses
            </Button>

        </>
    )
}

