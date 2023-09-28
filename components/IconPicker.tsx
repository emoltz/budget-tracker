import React from "react";
import {ActionIcon} from "@mantine/core";
import {icons} from "@/lib/icons";
import {changeCategoryIcon} from "@/lib/firebase";
import {useAuth} from "@/app/context";
import Loading from "@/app/login/loading";


interface IconPickerProps {
    onSelect: (iconName: string) => void;
    categoryName?: string;
}

// @ts-ignore
export default function IconPicker({onSelect, categoryName}: IconPickerProps): React.JSX.Element {
    const {user, loading} = useAuth();
    const onIconChange = async (categoryName: string, iconName: string) => {
        if (user) {
            await changeCategoryIcon(user, iconName, categoryName).then(() => {
                console.log("Icon changed")
            });
        }
    }

    if (loading){
        return <Loading/>
    }

    return (
        <div className={"grid grid-cols-4"}>
            {icons.map(icon => {
                return (
                    <ActionIcon
                        variant={""}
                        key={icon.name}
                        onClick={() => {
                            onSelect(icon.name)
                            if (categoryName) {
                                onIconChange(categoryName, icon.name);
                            }

                        }}
                    >
                        {icon.component}
                    </ActionIcon>
                )
            })}
        </div>
    )
}
