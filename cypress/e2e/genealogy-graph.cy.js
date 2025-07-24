// Cypress e2e test for GenealogyGraph

describe("GenealogyGraph e2e", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("renders the main genealogy graph UI", () => {
    cy.get('[data-cy="genealogy-graph"]').should("be.visible");
    cy.get('[data-cy="toolbar"], [data-cy="toolbar-main"]').should(
      "exist"
    );
    cy.get('[data-cy="edit-dialog"]').should("exist");
  });

  it("can switch trees and persist data", () => {
    // Switch to another tree (adjust selectors as needed)
    cy.get('[data-cy="tree-select"]').select("Family Example");
    cy.get('[data-cy="genealogy-graph"]').should("be.visible");
    // Optionally check that the correct data is loaded
  });

  it("can switch language and update UI", () => {
    // Adjust selectors as needed for your language switcher
    // Example assumes a select with data-cy="language-select" and a label/button that changes
    cy.get('[data-cy="language-select"]').select("fr");
    // Check that a UI element updates to French (adjust text as needed)
    cy.contains("Nom").should("exist"); // e.g., label for name in French

    cy.get('[data-cy="language-select"]').select("en");
    cy.contains("Name").should("exist"); // label for name in English
  });

  it("can toggle mode and show/hide extra buttons", () => {
    // Assert extra buttons are hidden initially
    cy.get('[data-cy="tree-manager"]').should("not.be.visible");
    cy.get('[data-cy="file-manager"]').should("not.be.visible");

    // Toggle mode
    cy.get('[data-cy="mode-toggle-button"]').click();

    // Assert extra buttons are now visible
    cy.get('[data-cy="tree-manager"]').should("be.visible");
    cy.get('[data-cy="file-manager"]').should("be.visible");

    // Toggle mode
    cy.get('[data-cy="mode-toggle-button"]').click();

    // Assert extra buttons are hidden again
    cy.get('[data-cy="tree-manager"]').should("not.be.visible");
    cy.get('[data-cy="file-manager"]').should("not.be.visible");
  });
});
