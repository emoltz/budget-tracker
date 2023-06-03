'use client';
import {Table} from '@nextui-org/react';
import RootLayout from "@/app/layout";
import {faker} from '@faker-js/faker';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
} from 'chart.js';
import {Line} from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
);
export default function Debug() {
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Chart.js Line Chart',
            },
        },
    };
    const labels: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

    const data = {
        labels,
        datasets: [
            {
                fill: true,
                label: 'Dataset 2',
                data: labels.map(() => faker.datatype.number({min: 0, max: 1000})),
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };


    return (
        <>
            <RootLayout>
                <Line options={options} data={data}/>
                <Table
                    aria-label="Example static collection table with multiple selection"
                    css={{
                        height: "auto",
                        minWidth: "100%",
                    }}
                    selectionMode="multiple"
                >
                    <Table.Header>
                        <Table.Column>NAME</Table.Column>
                        <Table.Column>ROLE</Table.Column>
                        <Table.Column>STATUS</Table.Column>
                    </Table.Header>
                    <Table.Body>
                        <Table.Row key="1">
                            <Table.Cell>Tony Reichert</Table.Cell>
                            <Table.Cell>CEO</Table.Cell>
                            <Table.Cell>Active</Table.Cell>
                        </Table.Row>
                        <Table.Row key="2">
                            <Table.Cell>Zoey Lang</Table.Cell>
                            <Table.Cell>Technical Lead</Table.Cell>
                            <Table.Cell>Paused</Table.Cell>
                        </Table.Row>
                        <Table.Row key="3">
                            <Table.Cell>Jane Fisher</Table.Cell>
                            <Table.Cell>Senior Developer</Table.Cell>
                            <Table.Cell>Active</Table.Cell>
                        </Table.Row>
                        <Table.Row key="4">
                            <Table.Cell>William Howard</Table.Cell>
                            <Table.Cell>Community Manager</Table.Cell>
                            <Table.Cell>Vacation</Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>

            </RootLayout>
        </>
    )
}
