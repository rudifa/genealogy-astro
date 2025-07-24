describe('Language Switcher', () => {
  beforeEach(() => {
    cy.clearAppData();
    cy.visit('/');
  });

  it('should display language selector', () => {
    cy.get('[data-cy="language-switcher"]').should('be.visible');
    cy.get('[data-cy="language-select"]').should('be.visible');
  });

  it('should have available language options', () => {
    cy.get('[data-cy="language-select"]').within(() => {
      cy.get('option[data-cy="lang-en"]').should('exist');
      cy.get('option[data-cy="lang-fr"]').should('exist');
      cy.get('option[data-cy="lang-de"]').should('exist');
    });
  });

  it('should switch to French', () => {
    cy.get('[data-cy="language-select"]').select('fr');
    cy.wait(500); // Wait for language switch to complete
    cy.get('[data-cy="language-select"]').should('have.value', 'fr');
  });

  it('should switch to German', () => {
    cy.get('[data-cy="language-select"]').select('de');
    cy.wait(500); // Wait for language switch to complete
    cy.get('[data-cy="language-select"]').should('have.value', 'de');
  });

  it('should switch back to English', () => {
    cy.get('[data-cy="language-select"]').select('fr');
    cy.wait(500);
    cy.get('[data-cy="language-select"]').select('en');
    cy.wait(500);
    cy.get('[data-cy="language-select"]').should('have.value', 'en');
  });
});
