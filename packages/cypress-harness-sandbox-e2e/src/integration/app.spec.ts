describe('cypress-harness-sandbox', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    cy.get('h1').contains(`🚀 Let's test!`);
  });
});
