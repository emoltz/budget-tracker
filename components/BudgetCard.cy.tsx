import React from 'react';
import BudgetCard from './BudgetCard';
import {icons} from '@/lib/icons';

const props = {
    budgetName: 'Groceries',
    budgetAmount: 200,
    spent: 150,
    id: '1',
    iconName: icons[0].name,
};

describe('<BudgetCard />', () => {
    it('renders the correct budget name and amount', () => {

        cy.mount(<BudgetCard {...props} />);
    });

    it('calculates the correct money left and shows the correct badge color', () => {
        cy.mount(<BudgetCard {...props} />);
        cy.get('[data-test="money-left"]').should('contain', '$50.00 left');
    });

    it('calculates the correct progress percentage', () => {
        const props = {
            budgetName: 'Groceries',
            budgetAmount: 200,
            spent: 100,
            id: '1',
            iconName: icons[0].name,
        };

        cy.mount(<BudgetCard {...props} />);
        cy.get('[data-test="budget-progress-percent"]').should('contain', '50%');
    });


});
