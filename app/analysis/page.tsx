"use client";
import React , { useState, useEffect } from 'react';
import { useAuth } from "@/app/context";
// import { CategoryBudget } from "@/lib/Interfaces";
import { getCategoryBudgets, getExpenses } from "@/lib/firebase";
import { useMantineColorScheme } from '@mantine/core';
import Loading from "@/app/loading";
import AreaChartView from "@/components/AreaChartView"
import CategoryMultiSelect from "@/components/CategoryMultiSelect"
import { ChartBarIcon, ChartPieIcon } from "@heroicons/react/solid";

import {
    Accordion, AccordionHeader, AccordionBody,
    BadgeDelta,
    BarChart,
    Card,
    DonutChart,
    Flex,
    Grid,
    Metric,
    ProgressBar,
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
    const [categoryBudgets, setCategoryBudgets] = useState<{[key : string] : string | number;}[]>([]);
    const [budgetInfo, setBudgetInfo] = useState<{[key : string] : number;}>({
            totalSpent : 0,
            totalBudget: 0,
            budgetsExceeded: 0,
        });
    const [selectedTime, setSelectedTime] = useState(0); // time selection
    const [currentIndex, setIndex] = useState<number>(0); // bars - circle
    const [dailyData, setDailyData] = useState< {[key : string] : number | string}[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>(
        ["Food", "Groceries", "Activities", "Housing", "Transportation", "Medical & Healthcare", "Personal Spending"]
    )

    useEffect(() => {
        if (user) {
            getCategoryBudgets(user).then(data => {
                const info = {
                    totalSpent : 0,
                    totalBudget: 0,
                    budgetsExceeded: 0,
                }
                const categories : {[key : string] : string | number}[] = []
    
                data.forEach((cb) => {
                    // generate meta-stats about budgets
                    let amtSpent = cb["spent"] || 0;
                    let amtLeft = cb["budgetAmount"] - amtSpent;
                    let amtOver = 0
                    
                    info.totalSpent += amtSpent,
                    info.totalBudget += cb["budgetAmount"]
                    
                    if (amtLeft < 0) {
                        amtOver = amtSpent - cb["budgetAmount"];
                        amtSpent = cb["budgetAmount"]; // not ideal
                        amtLeft = 0;                    
                        info.budgetsExceeded += 1
                    }
    
                    // add calculated fields to CategoryBudgets for bar chart display
                    const chartData = {
                        ...cb,
                        "Amount Spent" : amtSpent,
                        "Amount Left" : amtLeft,
                        "Amount Over" : amtOver
                    }
                    
                    categories.push(chartData)
                })
    
                setBudgetInfo(info);
                setCategoryBudgets(categories);
            }).catch(error => console.log("getCategoryBudgets error" + error)) 
            
            const currentDate = new Date();
            
            // create list with values for each day this month up to current date
            const dailies : {[key : string] : number}[] = 
                Array.from({ length : currentDate.getDate() + 1 }, (value, index) => ({
                        Day: index,
                        Food: 0,
                        Activities: 0,
                        Transportation: 0,
                        Groceries: 0,
                        Housing: 0,
                        "Medical & Healthcare": 0,
                        "Personal Spending" : 0
                    })
                )
            
            getExpenses(user, currentDate.getMonth() + 1, currentDate.getFullYear())
                .then(expenses => {
                    expenses.forEach((exp) => {
                        const key = new Date(exp.date as string).getDate();
                        console.log(exp.name, key)
                        if (dailies[key]) {
                            dailies[key][exp.category] += exp.amount
                        }
                        else
                        console.log(dailies)
                        
                    })
                    setDailyData(Object.values(dailies))
                }).catch(error => console.log("getExpenses error" + error))
        }
                                  
    }, [user])

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
        <Flex className={`p-4 ${colorScheme == 'dark' ? "dark" : ""}`}>
            <TabGroup className="mt-2 flex-grow">
                <TabList>
                    <Tab>This Month</Tab>
                    <Tab>Spending Over Time</Tab>
                    <Tab>Income Over Time</Tab>
                </TabList>

                <Accordion defaultOpen={true} className="w-full mt-2">
                    <AccordionHeader>Filters</AccordionHeader>
                    <AccordionBody >
                        <Flex className="place-content-center gap-2">
                            <TabGroup index={selectedTime} onIndexChange={setSelectedTime}>
                                <TabList color="gray" variant="solid">
                                    <Tab>This Month</Tab>
                                    <Tab>3 Months</Tab>
                                    <Tab>6 Months</Tab>
                                    <Tab>1 Year</Tab>
                                </TabList>
                            </TabGroup>
                            <CategoryMultiSelect onCategoriesChange={(vals) => setSelectedCategories(vals)}/>
                        </Flex>
                    </AccordionBody>
                </Accordion>

                <TabPanels>
                    <TabPanel>
                        {/* <Grid numItemsMd={2} numItemsLg={2} className="gap-6 mt-6">
                            <Card>
                                <Flex alignItems="start">
                                    <div className="truncate">
                                        <Text>Spent so far</Text>
                                        <Metric className="truncate">
                                            ${ `${Intl.NumberFormat("us").format(budgetInfo.totalSpent as number)}`}
                                        </Metric>
                                    </div>
                                    <BadgeDelta deltaType="moderateIncrease">12.5%</BadgeDelta>
                                </Flex>
                                <Flex className="mt-4 space-x-2">
                                    <Text className="truncate">
                                        {`${(budgetInfo.totalSpent / budgetInfo.totalBudget * 100).toFixed()}%`}
                                    </Text>
                                    <Text>{`$ ${Intl.NumberFormat("us").format(budgetInfo.totalBudget)}`}</Text>
                                </Flex>
                                <ProgressBar value={Math.trunc(budgetInfo.totalSpent / budgetInfo.totalBudget * 100)} className="mt-2" />
                            </Card>
                            <Card>
                                <Flex alignItems="start">
                                    <div className="truncate">
                                        <Text>Budgets exceeded</Text>
                                        <Metric className="truncate">{budgetInfo.budgetsExceeded} / {categoryBudgets.length}</Metric>
                                    </div>
                                </Flex>
                                
                            </Card>
                        </Grid> */}
                        <Flex className='mt-6'>
                            <Card>
                                <TabGroup onIndexChange={() => setIndex(currentIndex === 0 ? 1 : 0)}>
                                    <div className="flex justify-between">
                                        <div>
                                            <Title>{currentIndex === 0 ? "Budget progress" : "Spending breakdown"}</Title>
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
                                                category="Amount Spent" // TODO: fix this for over-budget categories
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
                                <AreaChartView 
                                    title="Trends" 
                                    tooltip="Spending over time"
                                    data={Object.values(dailyData)}
                                    selectedCategories={selectedCategories}/>
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
           
        </Flex>
    );
}
