import React from "react";
import {ActionIcon} from "@mantine/core";
import {icons} from "@/lib/icons";
import {changeCategoryIcon} from "@/lib/firebase";
import {useAuth} from "@/app/context";
import Loading from "@/app/login/loading";


interface IconPickerProps {
    onSelect: (iconName: string) => void;
    categoryID: string;
}

// @ts-ignore
export default function IconPicker({onSelect, categoryID}: IconPickerProps): React.JSX.Element {
    const {user, loading} = useAuth();
    const onIconChange = async (categoryID: string, iconName: string) => {
        if (user) {
            await changeCategoryIcon(user, iconName, categoryID).then(() => {
                // console.log("Icon changed")
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
                            onIconChange(categoryID, icon.name).then(r => {
                                console.log("Icon changed: ", r)
                            });
                        }}
                    >
                        {icon.component}
                    </ActionIcon>
                )
            })}
        </div>
    )
}
