"use client";
import { CategoryBudget } from "@/lib/Interfaces";
import { FiPlus } from "react-icons/fi";
import { Button, Input, Modal, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useAuth } from "@/app/context";
import { Spacer } from "@nextui-org/react";
import { useCategoryBudgets_currentMonth } from "@/lib/firebase";
import BudgetByCategory from "@/components/BudgetByCategory";
import IconPicker from "@/components/IconPicker";
import { icons } from "@/lib/icons";
import React, { useState } from "react";

export default function Budgets() {
  //   const user = useAuth();
  const { user, loading } = useAuth();
  const [opened, { open, close }] = useDisclosure(false);
  const categoryObject = useCategoryBudgets_currentMonth(user);
  const icon = icons.find((icon) => icon.name === "dashboard");
  const [selectedIcon, setSelectedIcon] = useState(icon);
  if (loading) {
    return <div>Loading...</div>;
  }

  const handleIconSelect = (iconId: string) => {
    const selectedIcon = icons.find((icon) => icon.name === iconId);
    setSelectedIcon(selectedIcon);
  };

  return (
    <>
      <h1>Budgets</h1>
      <ul className={"p-3"}>
        {categoryObject.map((category: CategoryBudget) => (
          <li className={"my-3"} key={category.category}>
            <BudgetByCategory category_name={category.category} />
          </li>
        ))}
      </ul>
      <Button
        leftIcon={<FiPlus />}
        variant={"outline"}
        color={"dark"}
        compact
        onClick={open}
      >
        New Category
      </Button>

      <Button variant={"outline"}>Save all Changes</Button>

      <Modal
        size={"xl"}
        zIndex={1000}
        opened={opened}
        onClose={close}
        title="Add New Budget Category"
        centered
      >
        {/* Modal content */}
        <Text>
          This allows you to create a new budget category and assign it a budget
          for the month.
        </Text>

        <Text>
          Category Name:
          <Input />
        </Text>
        <Text>
          Budget Amount:
          <Input type="number" placeholder="500" />
        </Text>
        <Spacer y={1} />
        <IconPicker onSelect={handleIconSelect} categoryName={"Activities"} />
        <Button variant={"light"} color={"cyan"} onClick={close}>
          Save new Category/Budget
        </Button>
      </Modal>
    </>
  );
}
