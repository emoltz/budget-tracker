import React from "react";
import {useDisclosure} from "@mantine/hooks";
import {Button, Input, Modal, NumberInput, Text} from "@mantine/core";
import {CategoryPicker} from "@/components/CategoryPicker";
import {Spacer} from "@nextui-org/react";
import {ColorPicker} from "@/components/ColorPicker";
import {CustomButton} from "@/lib/Interfaces";
import {IconPlus} from "@tabler/icons-react";
import {icons} from "@/lib/icons";

const sampleButtons: CustomButton[] = [
    {
        iconName: "train",
        label: "Train",
        color: "cyan",
        action: {
            cost: 5,
            category: "Transportation"
        },
        onClick: () => console.log("clicked")
    },
    {
        iconName: "bell",
        label: "Lunch",
        color: "light",
        action: {
            cost: 15,
            category: "Food"
        },
        onClick: () => console.log("clicked")
    },
    {
        iconName: "beer",
        label: "Bar",
        color: "red",
        action: {
            cost: 20,
            category: "Activities"
        },
        onClick: () => {
            console.log("clicked");
        }
    },
]


export const CustomButtons = () => {

    // const [buttons, setButtons] = useState([]);
    const [opened, {open, close}] = useDisclosure(false);


    return (
        <>

            <div
                className={"grid grid-cols-2 gap-2"}
            >
                {sampleButtons.map((button, index) => (
                    <CustomButton
                        key={index}
                        iconName={button.iconName}
                        action={button.action}
                        label={button.label}
                        color={button.color}
                        onClick={button.onClick}
                    />))}

            </div>
            {/*ADD NEW BUTTON*/}
            <div className={"p-2"}/>
            <div className={""}>
                <Button
                    leftIcon={<IconPlus size={20}/>}
                    variant={"outline"}
                    compact
                    onClick={open}
                >
                    New
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


        </>
    )
}


const CustomButton = ({iconName, label, color, action, onClick}: CustomButton) => {
    //   find icon
    const iconObject = icons.find(icon => icon.name === iconName);
    const IconComponent: React.JSX.Element | null = iconObject ? iconObject.component : null;


    return (
        <Button
            leftIcon={IconComponent}
            variant={"outline"}
            color={color}
            compact
            onClick={onClick}
        >
            {label}
        </Button>
    )
}