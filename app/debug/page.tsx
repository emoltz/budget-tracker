'use client';

import {Button} from "@mantine/core";

export default function Debug() {
    return (
        <>
            <div className={"grid grid-cols-2 gap-3"}>

                <Button
                    variant={"outline"}
                >
                    Hello!
                </Button>
                <Button
                    variant={"outline"}
                >
                    Hello!
                </Button><Button
                variant={"outline"}
            >
                Hello!
            </Button>

            </div>
        </>
    )
}
