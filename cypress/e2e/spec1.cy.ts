describe('visit production site', () => {
  it('passes', () => {
    cy.visit('https://budget-tracker-navy.vercel.app/')
    cy.contains('Welcome, login with')
  })
})