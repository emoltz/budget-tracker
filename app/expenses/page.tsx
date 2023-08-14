"use client"
import {DataTable} from "./data-table"
import {columns} from "./columns";
import {fakeData} from '@/lib/fakeData/fakeExpenseData'
import {
    IconArrowBigLeft,
    IconArrowBigRight
} from "@tabler/icons-react";
// import {Button} from "@mantine/core";
import {Button} from "@/components/ui/button";

export default function page() {

    const currentDateData = {
        month: "August",
        year: 2023,
    }
    return (
        <>
            <div className={"pt-5 pl-5"}>
                <div className={"text-4xl font-bold pb-2"}>
                    {currentDateData.month} {currentDateData.year}
                </div>

                <div className={"flex flex-row justify-between"}>
                    <div className={"flex flex-row"}>
                        <div className={"text-2xl font-bold"}>
                            <Button variant={"outline"}>
                                <IconArrowBigLeft/>

                            </Button>

                        </div>
                        <div className={"text-2xl font-bold"}>
                            <Button variant={"outline"}>
                                <IconArrowBigRight/>
                            {/*    TODO this should change the month back and forth*/}
                            </Button>
                        </div>
                    </div>
                </div>

            </div>
            <div className="container mx-auto py-10">
                <DataTable columns={columns} data={fakeData}/>
            </div>


        </>
    )
}