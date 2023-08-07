import React from 'react'
import AddNewExpense from './AddNewExpense'

describe('<AddNewExpense />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<AddNewExpense />)
  })
})