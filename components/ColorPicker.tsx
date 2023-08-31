import {Select} from "@mantine/core";
import React from "react";

export const ColorPicker = () => {
    const data = [
        // colors
        {value: 'cyan', label: 'Cyan'},
        {value: 'blue', label: 'Blue'},
        {value: 'gray', label: 'Gray'},
        {value: 'red', label: 'Red'},
        {value: 'yellow', label: 'Yellow'},
        {value: 'teal', label: 'Teal'},
        {value: 'indigo', label: 'Indigo'},
        {value: 'green', label: 'Green'},
        {value: 'pink', label: 'Pink'},
        {value: 'purple', label: 'Purple'},
        //TODO put actual thumbnails with colors also (see Mantine documentation)
    ]

    return (
        <Select data={data}
                placeholder={"Select a Color"}
                maxDropdownHeight={100}
                transitionProps={{duration: 150, transition: 'pop-top-left', timingFunction: 'ease'}}
                dropdownComponent={"div"}
                searchable
                clearable

                nothingFound={"We can't do that color :("}
        />
    )

}