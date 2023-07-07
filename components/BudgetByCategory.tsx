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
  FiPlus,
} from "react-icons/fi";
import { Category } from "@/lib/Interfaces";

export default function BudgetByCategory(props: any): JSX.Element {
  // TODO add category interface
  return (
    <>
      <Paper shadow="xs" radius="xl" p="md" withBorder>
        <IoFastFoodOutline></IoFastFoodOutline>
        <p>{props.category}</p>

        <TextInput type="number" placeholder="1000" label="Budget amount" />
      </Paper>
    </>
  );
}
