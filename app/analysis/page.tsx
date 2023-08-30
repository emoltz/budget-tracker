"use client";
import React , { useState, useEffect } from 'react';
import { useAuth } from "@/app/context";
import { CategoryBudget } from "@/lib/Interfaces";
import { getCategoryBudgets } from "@/lib/firebase";
import { useMantineColorScheme } from '@mantine/core';
import Loading from "@/app/loading";
import ChartView from "@/components/ChartView"
import { ChartBarIcon, ChartPieIcon } from "@heroicons/react/solid";

import {
    BadgeDelta,
    BarChart,
    Card,
    DonutChart,
    Flex,
    Grid,
    Metric,
    ProgressBar,
    Subtitle,
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
    Text,
    Title,
} from "@tremor/react";

export default function Page() {
    const {user, loading} = useAuth();
    const {colorScheme} = useMantineColorScheme();

    // this is typed just as a dict so that it can be used with charts
    const [categoryBudgets, setCategoryBudgets] = useState<{[key : string] : any;}[]>([]);
    const [totalSpent, setTotalSpent] = useState<number>(0);
    const [totalBudgets, setTotalBudgets] = useState<number>(0);
    const [numExceeded, setExceeded] = useState<number>(0);
    // let numExceeded = 0;
    // TODO consolidate states
    const [currentIdx, setIndex] = useState<number>(0)

    useEffect(() => {
        async function fetchData() {
            if (user) {
                setCategoryBudgets([]); // reset so appending doesn't duplicate data
                const data : CategoryBudget[] = await getCategoryBudgets(user);
                data.forEach((cb) => {
                    let amtSpent = cb["spent"] || 0;
                    let amtLeft = cb["budgetAmount"] - amtSpent;
                    let amtOver = 0

                    setTotalSpent((spent) => spent + amtSpent);
                    setTotalBudgets((budget) => budget + cb["budgetAmount"]);
                    
                    if (amtLeft < 0) {
                        amtOver = amtSpent - cb["budgetAmount"];
                        amtSpent = cb["budgetAmount"]; // not ideal
                        amtLeft = 0;
                        setExceeded((num) => num + 1);
                    }

                    const chartData = {
                        ...cb,
                        "Amount Spent" : amtSpent,
                        "Amount Left" : amtLeft,
                        "Amount Over" : amtOver
                    }
                    
                    setCategoryBudgets((categoryBudgets) =>
                        [...categoryBudgets, chartData])
                    
                    
                })
            }
        }
  
        // noinspection JSIgnoredPromiseFromCall
        fetchData();
        // setTotal(categoryBudgets && categoryBudgets.map((category) => category["spent"] || 0)
        //                         .reduce((sum, curr) => sum + curr, 0));
        
                                
    }, [user])

    // console.log(totalSpent)

    if (loading) {
        return <Loading/>; // Or return a loading spinner
    }

    if (!user) {
        return <p>Please log in</p>
        // return <LoginMantine/>;
    }

    const numberFormatter = (number: number) =>
        `$ ${Intl.NumberFormat("us").format(number).toString()}`

    return (
        <div className={`p-4 ${colorScheme == 'dark' ? "dark" : ""}`}>
            <TabGroup className="mt-2">
                <TabList>
                    <Tab>This Month</Tab>
                    <Tab>Spending Over Time</Tab>
                    <Tab>Income Over Time</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel>
                        <Grid numItemsMd={2} numItemsLg={2} className="gap-6 mt-6">
                            <Card>
                                <Flex alignItems="start">
                                    <div className="truncate">
                                        <Text>Spent so far</Text>
                                        <Metric className="truncate">
                                            ${ `${Intl.NumberFormat("us").format(totalSpent as number)}`}
                                        </Metric>
                                    </div>
                                    {/* dummy badgeDelta data below */}
                                    <BadgeDelta deltaType="moderateIncrease">12.5%</BadgeDelta>
                                </Flex>
                                <Flex className="mt-4 space-x-2">
                                    <Text className="truncate">
                                        {`${(totalSpent / totalBudgets * 100).toFixed()}%`}
                                    </Text>
                                    <Text>{`$ ${Intl.NumberFormat("us").format(totalBudgets)}`}</Text>
                                </Flex>
                                <ProgressBar value={Math.trunc(totalSpent / totalBudgets * 100)} className="mt-2" />
                            </Card>
                            <Card>
                                <Flex alignItems="start">
                                    <div className="truncate">
                                        <Text>Budgets exceeded</Text>
                                        <Metric className="truncate">{numExceeded} / {categoryBudgets.length}</Metric>
                                    </div>
                                </Flex>
                                
                            </Card>
                        </Grid>
                        <Flex className='mt-6'>
                            <Card>
                                <TabGroup onIndexChange={() => setIndex(currentIdx === 0 ? 1 : 0)}>
                                    <div className="flex justify-between">
                                        <div>
                                            <Title>{currentIdx === 0 ? "Budget progress" : "Spending breakdown"}</Title>
                                        </div>
                                        <div>
                                            <TabList variant={"solid"} className="self-justify-left">
                                                <Tab icon={ChartBarIcon}></Tab>
                                                <Tab icon={ChartPieIcon}></Tab>
                                            </TabList>  
                                        </div>
                                    </div>
                                
                                    <TabPanels>
                                        <TabPanel>
                                            <BarChart
                                                className="grow h-80"
                                                data={categoryBudgets}
                                                index="category"
                                                categories={["Amount Spent", "Amount Left", "Amount Over"]}
                                                colors={["teal", "gray", "fuchsia"]}
                                                valueFormatter={numberFormatter}
                                                stack={true}
                                                layout="vertical"
                                                yAxisWidth={90}
                                            />
                                        </TabPanel>
                                        <TabPanel>
                                            <DonutChart
                                                className="grow h-80"
                                                data={categoryBudgets}
                                                category="Amount Spent" // TODO: fix this
                                                index="category"
                                                valueFormatter={numberFormatter}
                                                colors={["teal", "gray", "violet", "indigo", "rose", "cyan", "amber"]}
                                                />
                                        </TabPanel>
                                    </TabPanels>
                                </TabGroup>
                            </Card>
                        </Flex>
                    </TabPanel>

                    <TabPanel>
                        <div className="mt-6">
                            <Card>
                                <ChartView />
                            </Card>
                        </div>
                    </TabPanel>

                    <TabPanel>
                        <div className="mt-6">
                            <Card>
                                <div className="h-96" />
                            </Card>
                        </div>
                    </TabPanel>
                
                </TabPanels>
            </TabGroup>
        </div>
    );
}
