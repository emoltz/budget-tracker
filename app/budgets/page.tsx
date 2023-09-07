"use client";
import { CategoryBudget } from "@/lib/Interfaces";
import { FiPlus } from "react-icons/fi";
import { Button, Input, Modal, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useAuth } from "@/app/context";
import { Spacer } from "@nextui-org/react";
import { useCategoryBudgets_currentMonth } from "@/lib/firebase";
import BudgetByCategory from "@/components/BudgetByCategory";

export default function Budgets() {
  //   const user = useAuth();
  const { user, loading } = useAuth();
  const [opened, { open, close }] = useDisclosure(false);
  const categoryObject = useCategoryBudgets_currentMonth(user);
  if (loading) {
    return <div>Loading...</div>;
  }

  // const categories = [
  //     "Food/Drink",
  //     "Groceries",
  //     "Activities",
  //     "Personal Items",
  //     "Transportation",
  //     "Home",
  //     "Health",
  // ];

  //   // Dummy data
  //   const Categories: Category[] | any = [
  //     {
  //       id: "1",
  //       month: "January",
  //       budget: 1000,
  //       category_name: "Food",
  //       year: 2023,
  //       spent: 500,
  //     },
  //     {
  //       id: "2",
  //       month: "February",
  //       budget: 1500,
  //       category_name: "Rent",
  //       year: 2023,
  //       spent: 1200,
  //     },
  //     {
  //       id: "3",
  //       month: "March",
  //       budget: 800,
  //       category_name: "Entertainment",
  //       year: 2023,
  //       spent: 600,
  //     },
  //     {
  //       id: "4",
  //       month: "April",
  //       budget: 2000,
  //       category_name: "Transportation",
  //       year: 2023,
  //       spent: 1800,
  //     },
  //     {
  //       id: "5",
  //       month: "May",
  //       budget: 1200,
  //       category_name: "Utilities",
  //       year: 2023,
  //       spent: 1000,
  //     },
  //   ];

  console.log(categoryObject);
  // Struggling to map the category object below in <ul> since its a "promise" type

  return (
    <>
      <h1>Budgets</h1>
      <ul className={"p-3"}>
        {categoryObject.map((category: CategoryBudget) => (
          <li key={category.category}>
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

      <Button>Save all Changes</Button>

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
        <Button variant={"light"} color={"cyan"} onClick={close}>
          Save new Category/Budget
        </Button>
      </Modal>
    </>
  );
}
