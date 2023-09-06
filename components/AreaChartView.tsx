"use client";
import {useState} from "react";

import {
    AreaChart,
    Card,
    DonutChart,
    Flex,
    Icon,
    Tab,
    TabList,
    TabGroup,
    TabPanel,
    TabPanels,
    Title,
} from "@tremor/react";
import { IconInfoCircleFilled } from '@tabler/icons-react';
import { ChartBarIcon, ChartPieIcon } from "@heroicons/react/solid";


interface Props {
    title: string,
    tooltip: string,
    dataDaily: object[],
    dataBudgets: {[key : string] : string | number;}[],
    selectedCategories: string[]
}
export default function AreaChartView({title, dataDaily, dataBudgets, tooltip, selectedCategories} : Props) {
    const [currentIndex, setIndex] = useState<number>(0); // bars - circle

    const numberFormatter = (number: number) =>
        `$ ${Intl.NumberFormat("us").format(number).toString()}`

    return (
        <>
            <Card>
                <TabGroup onIndexChange={() => setIndex(currentIndex === 0 ? 1 : 0)}>
                    <Flex justifyContent="start">
                        <Title>{currentIndex === 0 ? "Spending Over Time" : "Spending by Category"}</Title>
                        <Icon
                            icon={IconInfoCircleFilled}
                            variant="simple"
                            tooltip={tooltip}
                        />
                        <div className="ml-auto">
                            <TabList variant={"solid"} >
                                <Tab icon={ChartBarIcon}></Tab>
                                <Tab icon={ChartPieIcon}></Tab>
                            </TabList>  
                        </div>
                    </Flex>
                
                    <TabPanels>
                        <TabPanel>
                            <div className="mt-8 hidden sm:block">
                                <AreaChart
                                    className="mt-4 h-80 w-300"
                                    data={dataDaily.slice(1)}
                                    categories={selectedCategories}
                                    // index={Object.keys(data[0])[0]}
                                    index="Day"
                                    colors={["indigo", "fuchsia", "lime", "amber", "cyan", "orange", "gray"]}
                                    yAxisWidth={60}
                                    valueFormatter={numberFormatter}
                                    // stack={true}
                                    // stacking doesn't look great with this many categories
                                />
                            </div>
                        </TabPanel>
                        <TabPanel>
                            <DonutChart
                                className="grow h-80"
                                data={dataBudgets.filter((budget) => 
                                    selectedCategories.includes(budget.category.toString()))}
                                category="Amount Spent" // TODO: fix this for over-budget categories
                                index="category"
                                valueFormatter={numberFormatter}
                                colors={["teal", "gray", "violet", "indigo", "rose", "cyan", "amber"]}
                                />
                        </TabPanel>
                    </TabPanels>
                </TabGroup>
            </Card>
        </>
    )
}