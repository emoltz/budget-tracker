import {useAuth} from "@/app/context";
import {Category} from "@/lib/Interfaces";
import {useCategories} from "@/lib/firebase";
import {Select} from "@mantine/core";
import React from "react";

export function CategoryPicker({ onCategoryChange }: {onCategoryChange: (category: string) => void}){
    const {user, loading} = useAuth();
    // TODO fetch all categories from user
    const categories: Category[] = useCategories(user);
    // const data = userCategories.map((category) => category.category_name);
    // TODO add ability to create category from here!
    const data: string[] = categories ? categories.map((category) => category.category_name) : [];


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