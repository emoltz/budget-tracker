'use client';

import { Typography } from 'antd';
import { InputNumber } from 'antd';

const { Title } = Typography;

const categories = ['Food', 'Groceries', 'Activites', 'Personal items', 
'Transportation', 'Home', 'Health']

/*
Not sure if I'm using the styling correctly below...
I want to be able to just use normal CSS styling but it wasn't working
with typescript so got the code below from google, but want to just add
normal CSS styling...need to figure this out maybe using a layout/grid instead?
*/
import CSS from 'csstype';
const categoryStyles: CSS.Properties = {
  backgroundColor: 'rgba(255, 255, 255, 0.85)',
  bottom: '2rem',
  fontFamily: 'sans-serif',
  fontSize: '1.5rem',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
//   minWidth: '100px',
//   display: 'inline-block'
};

export default function Budgets() {

    return (
        <>
            <div>
                Welcome to the budgets page!
            </div>
            <div style={categoryStyles}>
                <Title level={4}>{categories[0]}</Title>
                <InputNumber min={0} defaultValue={0} />
            </div>
            <div style={categoryStyles}>
                <Title level={4}>{categories[1]}</Title>
                <InputNumber min={0} defaultValue={0} />
            </div>

            <div style={categoryStyles}>
                <Title level={4}>{categories[2]}</Title>
                <InputNumber min={0} defaultValue={0} />
            </div>

            <div style={categoryStyles}>
                <Title level={4}>{categories[3]}</Title>
                <InputNumber min={0} defaultValue={0} />
            </div>

            <div style={categoryStyles}>
                <Title level={4}>{categories[4]}</Title>
                <InputNumber min={0} defaultValue={0} />
            </div>

            <div style={categoryStyles}>
                <Title level={4}>{categories[5]}</Title>
                <InputNumber min={0} defaultValue={0} />
            </div>

            <div style={categoryStyles}>
                <Title level={4}>{categories[6]}</Title>
                <InputNumber min={0} defaultValue={0} />
            </div>
        </>
    )
}
