"use client";
import React from 'react';
import { useAuth } from "@/app/context";
import { Category } from "@/lib/Interfaces";
import { useCategories_deprecated } from "@/lib/firebase";
import { useMantineColorScheme } from '@mantine/core';
import Loading from "@/app/loading";
import ChartView from "@/components/ChartView"

import {
  BadgeDelta,
  Card,
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
  const categories: Category[] = useCategories_deprecated(user);
  // console.log(user)
  // console.log(categories)

  const totalSpent = categories.map((category) => category.spent)
                               .reduce((sum, curr) => sum + curr, 0);

  if (loading) {
      return <Loading/>; // Or return a loading spinner
  }

  if (!user) {
    return <p>Please log in</p>
      // return <LoginMantine/>;
  }

  return (
    <div className={`p-4 ${colorScheme == 'dark' ? "dark" : ""}`}>

      <TabGroup className="mt-2">
        <TabList>
          {/* <Tab>Overview</Tab> */}
          <Tab>Spending</Tab>
          <Tab>Income</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Grid numItemsMd={2} numItemsLg={2} className="gap-6 mt-6">
              <Card>
              <Flex alignItems="start">
                <div className="truncate">
                  <Text>Spent this month</Text>
                  <Metric className="truncate">${totalSpent}</Metric>
                </div>
                {/* dummy badgeDelta data below */}
                <BadgeDelta deltaType="moderateIncrease">12.5%</BadgeDelta>
              </Flex>
              </Card>
              <Card>
              <Flex alignItems="start">
                <div className="truncate">
                  <Text>Budgets exceeded</Text>
                  <Metric className="truncate">0 / 5</Metric>
                </div>
              </Flex>
              <Flex className="mt-4 space-x-2">
                    <Text className="truncate">{`$81% ($434)`}</Text>
                    <Text>{`$500`}</Text>
                  </Flex>
                  <ProgressBar value={81} className="mt-2" />
              </Card>
            </Grid>
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
