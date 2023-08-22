"use client"
import {Badge, createStyles, Group, Paper, Popover, Progress, rem, Text, ThemeIcon} from '@mantine/core';
import React, {useState} from "react";
import IconPicker from "@/components/IconPicker";
import {icons} from "@/lib/icons";
import Link from "next/link";


const ICON_SIZE = rem(60);

const useStyles = createStyles((theme) => ({
    card: {
        position: 'relative',
        overflow: 'visible',
        padding: theme.spacing.xl,
        paddingTop: `calc(${theme.spacing.xl} * 1.5 + ${ICON_SIZE} / 3)`,
    },

    icon: {
        position: 'absolute',
        top: `calc(-${ICON_SIZE} / 3)`,
        left: `calc(50% - ${ICON_SIZE} / 2)`,
    },

    title: {
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        lineHeight: 1,
    },
}));

interface BudgetCardProps {
    budgetName: string;
    budgetAmount: number;
    spent: number;
    iconName: string | undefined;
    id: string;
}

export default function BudgetCard({budgetName, budgetAmount, spent, id, iconName}: BudgetCardProps
) {
    const {classes} = useStyles();
    const icon = icons.find(icon => icon.name === iconName);
    const [selectedIcon, setSelectedIcon] = useState(icon)
    const moneyLeft: number = budgetAmount - spent;
    const percentProgress = (spent / budgetAmount) * 100;

    const handleIconSelect = (iconId: string) => {
        const selectedIcon = icons.find(icon => icon.name === iconId);
        setSelectedIcon(selectedIcon);

    }


    return (
        <Paper radius="md" withBorder className={classes.card} mt={`calc(${ICON_SIZE} / 3)`} data-test={"budget-card"}>
            <Popover width={200}
                     position={"right-start"}
                     withArrow
                     shadow={"lg"}>

                <Popover.Target>

                    <ThemeIcon className={classes.icon}
                               size={ICON_SIZE}
                               radius={ICON_SIZE}
                               data-test={"theme-icon"}
                    >
                        {selectedIcon?.component}
                    </ThemeIcon>
                </Popover.Target>
                <Popover.Dropdown>
                    <IconPicker onSelect={handleIconSelect} categoryID={id}/>
                </Popover.Dropdown>
            </Popover>

            <Text ta="center" fw={700} className={classes.title} data-test={"budget-name"}>
                {budgetName}
            </Text>
            <Text c="dimmed" ta="center" fz="sm" data-test={"budget-amount"}>
                ${budgetAmount} / month
            </Text>

            <Group position="apart" mt="xs">
                <Text fz="sm" color="dimmed" data-test={"budget-progress"}>
                    Progress
                </Text>
                <Text fz="sm" color="dimmed" data-test={"budget-progress-percent"}>
                    {
                        percentProgress.toFixed(0) === "NaN" ? "0" : percentProgress.toFixed(0)
                    }%
                </Text>
            </Group>

            <Progress value={percentProgress} mt={5} data-test={"budget-progress-bar"}/>

            <Group position="apart" mt="md">
                <Link href={"#"}>
                    {/*TODO: make this go to the page where we can edit budget info*/}
                    <Badge className={"hover:shadow"}>
                        edit
                    </Badge>
                </Link>
                <span/>
                <Badge
                    color={moneyLeft > 0 ? "green" : "red"}
                    size="sm"
                    data-test={"money-left"}
                >
                    ${
                    moneyLeft.toFixed(2) === "NaN" ? "0.00" : moneyLeft.toFixed(2)
                } left
                </Badge>
            </Group>
        </Paper>
    )
}