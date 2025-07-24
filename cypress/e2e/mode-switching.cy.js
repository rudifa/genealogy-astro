describe('UI Mode Switching', () => {
  beforeEach(() => {
    cy.clearAppData();
    cy.visit('/');
  });

  it('should start in default mode and allow switching', () => {
    // Check initial state
    cy.get('[data-cy="mode-toggle-button"]').should('be.visible');

    // Get initial mode
    cy.getUIMode().then((initialMode) => {
      cy.log(`Initial mode: ${initialMode}`);

      // Toggle to the other mode
      cy.get('[data-cy="mode-toggle-button"]').click();
      cy.wait(500);

      // Verify mode changed
      cy.getUIMode().then((newMode) => {
        expect(newMode).to.not.equal(initialMode);
        cy.log(`New mode: ${newMode}`);

        // Verify UI elements match the mode
        if (newMode === 'forest') {
          cy.get('[data-cy="tree-manager"]').should('be.visible');
          cy.get('[data-cy="file-manager"]').should('be.visible');
          cy.get('[data-cy="toolbar"]').should('not.have.class', 'one-tree-mode');
        } else {
          cy.get('[data-cy="tree-manager"]').should('not.be.visible');
          cy.get('[data-cy="file-manager"]').should('not.be.visible');
          cy.get('[data-cy="toolbar"]').should('have.class', 'one-tree-mode');
        }
      });
    });
  });

  it('should persist mode selection across page reloads', () => {
    // Set to forest mode
    cy.ensureForestMode();
    cy.getUIMode().should('equal', 'forest');

    // Reload page
    cy.reload();

    // Verify mode persisted
    cy.getUIMode().should('equal', 'forest');
    cy.get('[data-cy="tree-manager"]').should('be.visible');
    cy.get('[data-cy="file-manager"]').should('be.visible');
  });

  it('should allow programmatic mode setting', () => {
    // Set to one-tree mode programmatically
    cy.setUIMode('one-tree');
    cy.getUIMode().should('equal', 'one-tree');
    cy.get('[data-cy="toolbar"]').should('have.class', 'one-tree-mode');

    // Set to forest mode programmatically
    cy.setUIMode('forest');
    cy.getUIMode().should('equal', 'forest');
    cy.get('[data-cy="toolbar"]').should('not.have.class', 'one-tree-mode');
  });

  it('should have appropriate button tooltips for each mode', () => {
    // In one-tree mode, button should suggest going to forest mode
    cy.ensureOneTreeMode();
    cy.get('[data-cy="mode-toggle-button"]')
      .should('have.attr', 'title')
      .and('include', 'Forest');

    // In forest mode, button should suggest going to one-tree mode
    cy.ensureForestMode();
    cy.get('[data-cy="mode-toggle-button"]')
      .should('have.attr', 'title')
      .and('include', 'One Tree');
  });
});
