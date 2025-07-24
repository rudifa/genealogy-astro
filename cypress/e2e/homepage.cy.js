describe('Genealogy App - Homepage', () => {
  beforeEach(() => {
    cy.clearAppData();
    cy.visit('/');
  });

  it('should load the homepage successfully', () => {
    cy.get('h1').should('be.visible');
    cy.get('[data-cy="genealogy-graph"]').should('exist');
    cy.title().should('include', 'Family Tree');
  });

  it('should display the header with navigation elements', () => {
    cy.get('header').should('be.visible');
    cy.get('[data-cy="language-switcher"]').should('be.visible');
    cy.get('[data-cy="toolbar"]').should('be.visible');
  });

  it('should display the genealogy graph container', () => {
    cy.get('[data-cy="genealogy-graph"]').should('be.visible');
    cy.get('[data-cy="toolbar"]').should('be.visible');
  });

  it('should display the footer', () => {
    cy.get('footer').should('be.visible');
    cy.get('footer').should('contain.text', 'Genealogy');
  });
});
