// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Custom commands for genealogy app testing

// Command to load test data
Cypress.Commands.add('loadTestData', (dataFile = 'sample_tree.json') => {
  cy.fixture(dataFile).then((data) => {
    cy.window().then((win) => {
      win.localStorage.setItem('genealogyData', JSON.stringify(data));
    });
  });
});

// Command to clear app data
Cypress.Commands.add('clearAppData', () => {
  cy.window().then((win) => {
    win.localStorage.clear();
    win.sessionStorage.clear();
  });
});

// Command to wait for graph to be rendered
Cypress.Commands.add('waitForGraph', () => {
  cy.get('[data-cy="genealogy-graph"]', { timeout: 10000 }).should('be.visible');
  cy.get('svg', { timeout: 5000 }).should('be.visible');
});

// Command to select language
Cypress.Commands.add('selectLanguage', (language) => {
  cy.get('[data-cy="language-switcher"]').click();
  cy.get(`[data-cy="lang-${language}"]`).click();
});

// Command to check current UI mode
Cypress.Commands.add('getUIMode', () => {
  return cy.window().then((win) => {
    const mode = win.localStorage.getItem('genealogy-ui-mode');
    return mode === 'forest' ? 'forest' : 'one-tree';
  });
});

// Command to set UI mode
Cypress.Commands.add('setUIMode', (mode) => {
  cy.window().then((win) => {
    win.localStorage.setItem('genealogy-ui-mode', mode);
  });
  cy.reload();
});

// Command to ensure forest mode (where tree and file managers are visible)
Cypress.Commands.add('ensureForestMode', () => {
  cy.getUIMode().then((currentMode) => {
    if (currentMode !== 'forest') {
      cy.get('[data-cy="mode-toggle-button"]').click();
      cy.wait(500); // Wait for mode switch to complete
    }
  });
});

// Command to ensure one-tree mode
Cypress.Commands.add('ensureOneTreeMode', () => {
  cy.getUIMode().then((currentMode) => {
    if (currentMode !== 'one-tree') {
      cy.get('[data-cy="mode-toggle-button"]').click();
      cy.wait(500); // Wait for mode switch to complete
    }
  });
});

// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
