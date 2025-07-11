describe("Family Tree add, edit, delete using the tree manager dialogs", () => {
  beforeEach(() => {
    cy.clearAppData();
    cy.visit("/");
    cy.waitForGraph();
  });

  it("should add a new person, edit their parents, and delete the new person", () => {
    // Graph: check that Cyprian is not in the graph
    cy.get('[data-testid="genealogy-graph"] svg')
      .contains("text", "Cyprian")
      .should("not.exist");

    // Add Person Dialog: Cyprian
    cy.get('[data-testid="add-person-button"]').click(); // Open the dialog to add a new person
    cy.get('[data-testid="edit-dialog"]', {timeout: 1000}).should("be.visible");
    cy.get('[data-testid="edit-dialog"] input#person-name')
      .clear()
      .type("Cyprian");
    cy.get('[data-testid="edit-dialog"] form').submit(); // Submit the form and close the dialog

    cy.get('[data-testid="edit-dialog"]', {timeout: 1000}).should(
      "not.be.visible"
    );
    cy.get('[data-testid="genealogy-graph"] svg')
      .contains("text", "Cyprian")
      .should("exist");

    // Edit Person Dialog: add parents and info
    cy.get('[data-testid="genealogy-graph"] svg')
      .contains("text", "Cyprian")
      .parent("a")
      .click(); // Instead of clicking the text node, click the parent <a> element if it exists
    cy.get('[data-testid="edit-dialog"]', {timeout: 5000}).should("be.visible");
    cy.get('[data-testid="edit-dialog"] input#person-name').should(
      "have.value",
      "Cyprian"
    );
    cy.wait(50); // Wait - workaround for the loss of "Cyprian" in the input#person-name field
    cy.get('[data-testid="edit-dialog"] [data-testid="father-input"]')
      .clear()
      .type("Father of Cyprian");
    cy.get('[data-testid="edit-dialog"] [data-testid="mother-input"]')
      .clear()
      .type("Mother of Cyprian");
    cy.get('[data-testid="edit-dialog"] [data-testid="info-input"]')
      .clear()
      .type("Cyprress Tester");
    cy.get('[data-testid="edit-dialog"] form').submit(); // Submit the form and close the dialog

    cy.get('[data-testid="edit-dialog"]', {timeout: 5000}).should(
      "not.be.visible"
    );

    // Graph: check that the parents are added to the graph
    cy.get('[data-testid="genealogy-graph"] svg')
      .contains("text", "Father of Cyprian")
      .should("exist");
    cy.get('[data-testid="genealogy-graph"] svg')
      .contains("text", "Mother of Cyprian")
      .should("exist");
    cy.get('[data-testid="genealogy-graph"] svg')
      .contains("text", "Cyprress Tester")
      .should("exist");

      // Edit Person Dialog: remove Cyprian
    cy.get('[data-testid="genealogy-graph"] svg')
      .contains("text", "Cyprian")
      .parent("a")
      .click(); // Click the parent <a> element to open the edit dialog
    cy.get('[data-testid="edit-dialog"]', {timeout: 5000}).should("be.visible");
    cy.get('[data-testid="edit-dialog"] input#person-name').should(
      "have.value",
      "Cyprian"
    );
    cy.get('[data-testid="edit-dialog"] [data-testid="remove-button"]').click();
    cy.get('[data-testid="edit-dialog"]', {timeout: 5000}).should(
      "not.be.visible"
    );

    // Graph: check that Cyprian is removed from the graph (robust exact match)
    cy.get('[data-testid="genealogy-graph"] svg text').should($nodes => {
      const names = $nodes.toArray().map(el => el.textContent.trim());
      expect(names).not.to.include("Cyprian");
    });
  });
});
