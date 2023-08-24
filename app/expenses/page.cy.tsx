import React from 'react'
import Page from './page'

describe('<page />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Page />)
  })
})