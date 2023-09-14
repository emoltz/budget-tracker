"use client";
import { Grid, Col } from "@tremor/react";
import { IconPencil } from "@tabler/icons-react";
import { Card, Title, DonutChart, Button } from "@tremor/react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import AddGoalForm from "@/components/AddNewGoalForm";


const goal = [
    {
      name: "Saved so far",
      amount: 50,
    },
    {
      name: "Left to go",
      amount: 150,
    },
  ];

const valueFormatter = (number: number) => `$ ${Intl.NumberFormat("us").format(number).toString()}`;

export default function Page () {
    return (
        <>
            <p>
            Goals Page
            </p>
            <Grid numItems={1} numItemsMd={2} className="gap-2">
                <Card className="max-w-lg py-2">
                    <Title>Bike</Title>
                    <Button icon={IconPencil}/>    
                    
                    <DonutChart
                    className="mt-6"
                    data={goal}
                    category="amount"
                    index="name"
                    valueFormatter={valueFormatter}
                    colors={["amber", "indigo", "violet", "slate", "rose", "cyan"]}
                    />
                </Card>

                <Card className="max-w-lg py-2">
                    <Title>Vacation</Title>
                    <Button icon={IconPencil}/>   
                    
                    <DonutChart
                    className="mt-6"
                    data={goal}
                    category="amount"
                    index="name"
                    valueFormatter={valueFormatter}
                    colors={["violet", "rose", "indigo", "rose", "cyan", "amber"]}
                    />
                </Card>

                <AddGoalForm></AddGoalForm>

            </Grid>
        </>
    
    );
}