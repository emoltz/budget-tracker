import React from "react";
import {Color} from "@/lib/Interfaces"
// @ts-ignore
import {CirclePicker} from 'react-color'


export const availableColors: Color[] = [
    {
        name: "red",
        displayName: "Red",
        value: "#ba3333",
    },
    {
        name: "orange",
        displayName: "Orange",
        value: "#c49630",
    },
    {
        name: "yellow",
        displayName: "Yellow",
        value: "#c4b130",
    },
    {
        name: "green",
        displayName: "Green",
        value: "#4fbf4f",
    },
    {
        name: "blue",
        displayName: "Blue",
        value: "#4f8cbf",
    }

]


export const ColorPicker = () => {
    const colorRow = availableColors.map(color => color.value);

    return (
       <CirclePicker
           width={"100%"}
            colors={colorRow.map(color => color)}
           circleSize={20}
           onChange={(color: any) => {
               console.log(color)
           }}


       />


    );
};
