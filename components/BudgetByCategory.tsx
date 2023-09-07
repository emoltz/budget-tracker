import { Paper, TextInput } from "@mantine/core";

interface BudgetByCategoryProps {
  category_name: string;
}

export default function BudgetByCategory({
  category_name,
}: BudgetByCategoryProps) {
  return (
    <>
      <Paper shadow="xs" radius="xl" p="md" withBorder>
        <p>{category_name}</p>

        <TextInput type="number" label="Budget amount" />
      </Paper>
    </>
  );
}
