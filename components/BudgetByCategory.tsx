import {Flex, Button, TextInput} from '@mantine/core';
import { JsxElement } from 'typescript';
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
} from 'react-icons/fi';
import {Category} from "@/lib/Interfaces";

export default function BudgetByCategory(props: any): JSX.Element {
    // TODO add category interface
    return (
        <>
            <Flex
                mih={50}
                bg="rgba(0, 150, 255, 0.8)"
                gap="md"
                justify="flex-start"
                align="center"
                direction="row"
                wrap="wrap"
                >
                <IoFastFoodOutline></IoFastFoodOutline>
                <p>{props.name}</p>

                <TextInput
                    type="number"
                    placeholder="1000"
                    label="Budget amount"
                    />
            </Flex>
        </>
    )
}
