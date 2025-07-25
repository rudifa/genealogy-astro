describe("Recording 21/07/2025 at 16:01:49", () => {
  it("Recording 21/07/2025 at 16:01:49", () => {
    // TODO: Handle setViewport step
    cy.visit("/?lang=fr");
    cy.get("[data-testid='language-select']").select("fr").should("have.value", "fr");
    // cy.get("[data-testid='language-select']").clear().type("de");
    cy.get("[data-testid='tree-select']").select("Family Example").should("have.value", "Family Example");
    cy.get("[data-testid='add-person-button']").click();
    cy.get("#person-name").click();
    cy.get("#person-name").clear().type("Tim");
    cy.get("[data-testid='save-button']").click();
    // cy.get("#print-button").click();
    cy.get("[data-testid='tree-manager']").click();
    cy.get("#tree-manager-tree-name").click();
    cy.get("#tree-manager-tree-name").clear().type("New Family");
    cy.get("#create-tree-button").click();
    cy.get("[data-testid='add-person-button']").click();
    cy.get("#person-name").click();
    // TODO: Handle keyUp step
    cy.get("#person-name").clear().type("Holger");
    cy.get("[data-testid='save-button']").click();
    cy.get("#node1 polygon").click();
    cy.get("[data-testid='mother-input']").click();
    cy.get("[data-testid='mother-input']").clear().type("Vera");
    cy.get("[data-testid='father-input']").click();
    cy.get("[data-testid='father-input']").clear().type("Johann");
    cy.get("[data-testid='save-button']").click();
    cy.get("[data-testid='file-manager']").click();
    cy.get("#download-current-tree").click();
    cy.get("#file-manager-close").click();
    cy.get("[data-testid='language-select']").click();
    cy.get("[data-testid='language-select']").clear().type("ja");
  });
});
