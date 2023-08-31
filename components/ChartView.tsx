"use client";
import {useState} from "react";

import {
  AreaChart,
  Flex,
  Icon,
  Title,
  Text,
  Tab,
  TabList,
  TabGroup,
} from "@tremor/react";
import { IconInfoCircleFilled } from '@tabler/icons-react';

const data = [
  {
    Month: "Jan 21",
    Food: 150,
    Activities: 50,
    Transportation: 34
  },
  {
    Month: "Feb 21",
    Food: 200,
    Activities: 200,
    Transportation:298
  },
  {
    Month: "Mar 21",
    Food: 200,
    Activities: 0,
    Transportation:24
  },
  {
    Month: "Apr 21",
    Food: 100,
    Activities: 100,
    Transportation: 100
  },
];

export default function ChartView() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const numberFormatter = (number: number) =>
    `$ ${Intl.NumberFormat("us").format(number).toString()}`
  
  // dummy area chart data
  const areaChartArgs = {
    className: "mt-5 h-72",
    data: data,
    index: "Month",
    categories: ["Sales", "Profit"],
    colors: ["indigo", "fuchsia"],
    // showLegend: false,
    valueFormatter: numberFormatter,
    yAxisWidth: 56,
  };

  return (
    <>
      <div className="md:flex justify-between">
        <div>
          <Flex className="space-x-0.5" justifyContent="start" alignItems="center">
            <Title> Trends </Title>
            <Icon
              icon={IconInfoCircleFilled}
              variant="simple"
              tooltip="Shows daily increase or decrease of particular domain"
            />
          </Flex>
          <Text> Daily change per domain </Text>
        </div>
        <div>
          <TabGroup index={selectedIndex} onIndexChange={setSelectedIndex}>
            <TabList color="gray" variant="solid">
              <Tab>Latest</Tab>
              <Tab>3 Months</Tab>
              <Tab>6 Months</Tab>
              <Tab>1 Year</Tab>
            </TabList>
          </TabGroup>
        </div>
      </div>
      <div className="mt-8 hidden sm:block">
      <AreaChart
        className="mt-4 h-80"
        data={data}
        categories={["Food", "Activities", "Transportation"]}
        index={Object.keys(data[0])[0]}
        colors={["indigo", "fuchsia", "lime"]}
        yAxisWidth={60}
        valueFormatter={(number: number) =>
          `$ ${Intl.NumberFormat("us").format(number).toString()}`
        }
        stack={true}
      />
      </div>
    </>
  )
}