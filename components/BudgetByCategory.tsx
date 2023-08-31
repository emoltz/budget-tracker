import { Flex, Button, TextInput, Paper, Modal, Text } from "@mantine/core";
import { JsxElement } from "typescript";
import { IoFastFoodOutline } from "react-icons/io5";
import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
  FiMenu,
  FiBell,
  FiChevronDown,
} from "react-icons/fi";
import { Category } from "@/lib/Interfaces";

export default function BudgetByCategory({ category_name }: Category) {
  return (
    <>
      <Paper shadow="xs" radius="xl" p="md" withBorder>
        <p>{category_name}</p>

        <TextInput type="number" placeholder="1000" label="Budget amount" />
      </Paper>
    </>
  );
}
