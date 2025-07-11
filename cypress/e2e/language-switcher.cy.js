describe('Language Switcher', () => {
  beforeEach(() => {
    cy.clearAppData();
    cy.visit('/');
  });

  it('should display language selector', () => {
    cy.get('[data-testid="language-switcher"]').should('be.visible');
    cy.get('[data-testid="language-select"]').should('be.visible');
  });

  it('should have available language options', () => {
    cy.get('[data-testid="language-select"]').within(() => {
      cy.get('option[data-testid="lang-en"]').should('exist');
      cy.get('option[data-testid="lang-fr"]').should('exist');
      cy.get('option[data-testid="lang-de"]').should('exist');
    });
  });

  it('should switch to French', () => {
    cy.get('[data-testid="language-select"]').select('fr');
    cy.wait(500); // Wait for language switch to complete
    cy.get('[data-testid="language-select"]').should('have.value', 'fr');
  });

  it('should switch to German', () => {
    cy.get('[data-testid="language-select"]').select('de');
    cy.wait(500); // Wait for language switch to complete
    cy.get('[data-testid="language-select"]').should('have.value', 'de');
  });

  it('should switch back to English', () => {
    cy.get('[data-testid="language-select"]').select('fr');
    cy.wait(500);
    cy.get('[data-testid="language-select"]').select('en');
    cy.wait(500);
    cy.get('[data-testid="language-select"]').should('have.value', 'en');
  });
});
