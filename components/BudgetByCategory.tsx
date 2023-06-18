import {Flex, Button} from '@mantine/core';
import PropTypes from 'prop-types';


export default function BudgetByCategory(): JSX.Element {
    return (
        <>
            <h1>Budgets</h1>
            <Flex
                mih={50}
                bg="rgba(0, 0, 0, .3)"
                gap="md"
                justify="flex-start"
                align="center"
                direction="row"
                wrap="wrap"
                >
                <p>Tester</p>
                <Button>Button 2</Button>
                <Button>Button 3</Button>
                <Button>Button 1</Button>
                <Button>Button 2</Button>
                <Button>Button 3</Button>
            </Flex>
        </>
    )
}
