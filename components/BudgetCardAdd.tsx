"use client";
import {
  Badge,
  createStyles,
  Group,
  Paper,
  Progress,
  rem,
  Text,
  NumberInput,
} from "@mantine/core";
import React, { useState } from "react";
import { icons } from "@/lib/icons";
import Link from "next/link";
import IconPickerPopover from "@/components/IconPickerPopover";

const ICON_SIZE = rem(60);

const useStyles = createStyles((theme) => ({
  card: {
    position: "relative",
    overflow: "visible",
    padding: theme.spacing.xl,
    paddingTop: `calc(${theme.spacing.xl} * 1.5 + ${ICON_SIZE} / 3)`,
  },

  icon: {
    position: "absolute",
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
  iconName: string | null;
  id: string;
}

export default function BudgetCardAdd({
  budgetName,
  iconName,
}: BudgetCardProps) {
  const { classes } = useStyles();
  const icon = icons.find((icon) => icon.name === iconName);
  const [selectedIcon, setSelectedIcon] = useState(icon);

  const handleIconSelect = (iconId: string) => {
    const selectedIcon = icons.find((icon) => icon.name === iconId);
    setSelectedIcon(selectedIcon);
  };

  return (
    <Paper
      radius="md"
      withBorder
      className={classes.card}
      mt={`calc(${ICON_SIZE} / 3)`}
      data-test={"budget-card"}
    >
      {/*TODO: icon not changing dynamically!*/}
      <IconPickerPopover
        selectedIconName={icon?.name}
        onIconSelect={handleIconSelect}
        categoryName={budgetName}
      />

      <Text
        ta="center"
        fw={700}
        className={classes.title}
        data-test={"budget-name"}
      >
        {budgetName}
      </Text>
      <NumberInput
        placeholder="Enter new budget amount"
        hideControls
      ></NumberInput>
    </Paper>
  );
}
