import {useAuth} from "@/app/context";
import {getUserCategories} from "@/lib/firebase";
import React, { useState, useEffect } from "react";
import { MultiSelect } from '@mantine/core';

interface Props {
    onCategoriesChange: (category: string[]) => void,
    [restProps : string] : any;
}

export default function CategoryMultiSelect({ onCategoriesChange, ...restProps}: Props){
// export default function CategoryMultiSelect(){
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
            maxDropdownHeight={160}
            transitionProps={{duration: 150, transition: 'pop-top-left', timingFunction: 'ease'}}
            dropdownComponent={"div"}
            searchable
            clearable
            onChange={onCategoriesChange}
            miw={300}
            // value={restProps["value"] || ""}
            // error={restProps["error"]}
        />
        )
}