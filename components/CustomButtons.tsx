import React from "react";
import {useDisclosure} from "@mantine/hooks";
import {FaTrain} from "react-icons/fa";
import {FiAlertCircle, FiPlus} from "react-icons/fi";
import ComponentFrameCenter from "@/components/layouts/ComponentFrameCenter";
import {Button, Input, Modal, NumberInput, rem, Text} from "@mantine/core";
import {CategoryPicker} from "@/components/CategoryPicker";
import {Spacer} from "@nextui-org/react";
import {ColorPicker} from "@/components/ColorPicker";

const PRIMARY_COL_HEIGHT = rem(400);
export const CustomButtons = () => {
    type Button = {
        icon: React.ReactNode,
        label: string,
        color: string,
        onClick: () => void
    }

    // const [buttons, setButtons] = useState([]);
    const [opened, {open, close}] = useDisclosure(false);

    const sampleButtons: Button[] = [
        {
            icon: <FaTrain/>,
            label: "Train 1",
            color: "cyan",
            onClick: () => console.log("clicked")
        },
        {
            icon: <FiAlertCircle/>,
            label: "Lunch",
            color: "light",
            onClick: () => console.log("clicked")
        },
        {
            icon: <FaTrain/>,
            label: "Train 3",
            color: "red",
            onClick: () => {
                console.log("clicked");
            }
        },
    ]


    return (
        <>
            <ComponentFrameCenter
                PRIMARY_COL_HEIGHT={PRIMARY_COL_HEIGHT}
                title={"Custom Buttons"}
            >
                <div
                    className={"flex flex-wrap justify-center  space-x-1.5"}
                >
                    {sampleButtons.map((button, index) => (
                        <CustomButton
                            key={index}
                            icon={button.icon}
                            label={button.label}
                            color={button.color}
                            onClick={button.onClick}
                        />))}

                </div>
                {/*ADD NEW BUTTON*/}
                <div className={"p-2"}/>
                <div>
                    <Button
                        leftIcon={<FiPlus/>}
                        variant={"outline"}
                        compact
                        onClick={open}
                    >
                        New Button
                    </Button>
                </div>
                <div
                    style={{
                        paddingLeft: '200px'
                    }}
                >

                    <Modal
                        size={"xl"}
                        zIndex={1000}
                        opened={opened}
                        onClose={close}
                        title={"Add new button"}
                    >
                        {/*    MODAL CONTENT*/}
                        <Text>
                            This allows you to create a button that will log a specific expense every time you push it.
                        </Text>
                        <Text>
                            Button Name:
                            <Input/>
                        </Text>

                        <Text>
                            Button Icon:

                        </Text>

                        <Text>
                            Button Color:
                            <ColorPicker/>

                        </Text>
                        <Text>
                            Expense Category:
                            <CategoryPicker
                                onCategoryChange={
                                    (category) => console.log(category)
                                }

                            />
                        </Text>
                        <Text>
                            Price
                            <NumberInput

                                defaultValue={0}
                                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                formatter={(value) =>
                                    !Number.isNaN(parseFloat(value))
                                        ? `$ ${value}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
                                        : '$ '
                                }
                            />
                        </Text>
                        <Spacer y={1}/>
                        <Button
                            variant={"light"}
                            color={"cyan"}
                            onClick={close}>
                            Save
                        </Button>
                    </Modal>
                </div>

            </ComponentFrameCenter>


        </>
    )
}

interface CustomButtonProps {
    key: number;
    icon: React.ReactNode;
    label: string;
    color: string;
    onClick: () => void;
}

const CustomButton = ({icon, label, color, onClick}: CustomButtonProps) => {
    return (
        <Button
            leftIcon={icon}
            variant={"outline"}
            color={color}
            compact
            onClick={onClick}
        >
            {label}
        </Button>
    )
}