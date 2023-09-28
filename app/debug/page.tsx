"use client"
import IconPicker from "@/components/IconPicker";

export default function Debug() {

    return (
        <>
           <IconPicker onSelect={() => {
                console.log("Icon selected")

           }}
           />

            <div className="">

                ----
            </div>


        </>
    )
}

