import {Typography} from "antd";
import {InputNumber} from "antd";

export default function BudgetWidget({category}){
    return (
        <div
            style={{
                backgroundColor: 'maroon'
            }}
        >
            <Typography>{category}</Typography>
            <InputNumber min={0} defaultValue={0} />

        </div>


    )
}