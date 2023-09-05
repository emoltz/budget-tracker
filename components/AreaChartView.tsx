"use client";
import {useState} from "react";

import {
    AreaChart,
    Flex,
    Icon,
    Title,
    Tab,
    TabList,
    TabGroup,
} from "@tremor/react";
import { IconInfoCircleFilled } from '@tabler/icons-react';


interface Props {
    title: string,
    data: object[],
}
export default function AreaChartView({title, data} : Props) {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const numberFormatter = (number: number) =>
        `$ ${Intl.NumberFormat("us").format(number).toString()}`

    return (
        <>
            <div className="md:flex justify-between">
                <div>
                    <Flex className="space-x-0.5" justifyContent="start" alignItems="center">
                        <Title> {title} </Title>
                        <Icon
                            icon={IconInfoCircleFilled}
                            variant="simple"
                            tooltip="Shows daily increase or decrease of particular domain"
                        />
                    </Flex>
                </div>
                <div>
                    <TabGroup index={selectedIndex} onIndexChange={setSelectedIndex}>
                        <TabList color="gray" variant="solid">
                            <Tab>This Month</Tab>
                            <Tab>3 Months</Tab>
                            <Tab>6 Months</Tab>
                            <Tab>1 Year</Tab>
                        </TabList>
                    </TabGroup>
                </div>
            </div>
            <div className="mt-8 hidden sm:block">
                <AreaChart
                    className="mt-4 h-80 w-300"
                    data={data.slice(1)}
                    categories={["Food", "Groceries","Activities", "Transportation", "Housing", "Personal Spending", "Medical & Healthcare"]}
                    // index={Object.keys(data[0])[0]}
                    index="Day"
                    colors={["indigo", "fuchsia", "lime", "amber", "cyan", "orange", "gray"]}
                    yAxisWidth={60}
                    valueFormatter={numberFormatter}
                    // stack={true}
                    // stacking doesn't look great with this many categories
                />
            </div>
        </>
    )
}