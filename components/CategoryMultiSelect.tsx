import {useAuth} from "@/app/context";
import {getUserCategories} from "@/lib/firebase";
import React, { useState, useEffect } from "react";
import { MultiSelect } from '@mantine/core';

interface Props {
    onCategoriesChange: (category: string[]) => void,
    // currentCategories: string[]
}

// export default function CategoryMultiSelect({ onCategoriesChange, currentCategories }: Props){
export default function CategoryMultiSelect({ onCategoriesChange }: Props){
    const {user, loading} = useAuth();
    const [selectItems, setSelectItems] = useState<string[]>([]);

    useEffect(() => {
        getUserCategories(user)
            .then((data) => {
                setSelectItems(data)
                
                // setSelectItems(() => data.map((category) => {
                //     { value: }
                // }))
            }).catch(console.error);
    }, [user])
    
    return (
        <MultiSelect data={selectItems}
            placeholder={"Select categories"}
            // defaultValue={currentCategories}
            maxDropdownHeight={160}
            transitionProps={{duration: 150, transition: 'pop-top-left', timingFunction: 'ease'}}
            dropdownComponent={"div"}
            searchable
            clearable
            miw={300}
            onChange={onCategoriesChange}
            // value={restProps["value"] || ""}
            // error={restProps["error"]}
        />
        )
}