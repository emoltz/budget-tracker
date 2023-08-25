import {useAuth} from "@/app/context";
import {getUserCategories} from "@/lib/firebase";
import {Select} from "@mantine/core";
import React, {useEffect, useState} from "react";

interface Props {
    onCategoryChange: (category: string) => void,
    [restProps : string] : any;
}
export function CategoryPicker({ onCategoryChange, ...restProps}: Props){
    const {user} = useAuth();
 
    const [data, setData] = useState([]);

    useEffect(() => {
        getUserCategories(user)
            .then((res) => setData(res))
            .catch(console.error);
    }, [user])
   
    return (
        <Select data={data}
                placeholder={"Select a category"}
                maxDropdownHeight={160}
                transitionProps={{duration: 150, transition: 'pop-top-left', timingFunction: 'ease'}}
                dropdownComponent={"div"}
                searchable
                clearable
                onChange={onCategoryChange}
                value={restProps["value"] || ""}
                error={restProps["error"]}
        />
    )
}