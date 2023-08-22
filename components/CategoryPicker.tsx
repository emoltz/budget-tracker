import {useAuth} from "@/app/context";
import {getCategories} from "@/lib/firebase";
import {Select} from "@mantine/core";
import React,  { useState, useEffect } from "react";


export function CategoryPicker({ onCategoryChange }: {onCategoryChange: (category: string) => void}){
    const {user, loading} = useAuth();
    //// const categories: Category[] = useCategories(user);
    // const data = userCategories.map((category) => category.category_name);
    // TODO add ability to create category from here!
    ////const data: string[] = categories ? categories.map((category) => category.category_name) : [];

 
    const [data, setData] = useState(["Test"]);

    // not sure if there's a better way to get output from the async function
    useEffect(() => {
        if (user) {
            getCategories(user)
            .then((res) => setData(Object.keys(res)))
            .catch(console.error);
        }
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
        />
    )
}