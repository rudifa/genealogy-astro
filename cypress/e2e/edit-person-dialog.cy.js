// Cypress e2e test for EditPersonDialog

describe("EditPersonDialog e2e", () => {
  //   beforeEach(() => {
  //     cy.visit("/"); // Adjust if your app uses a different route
  //   });

  beforeEach(() => {
    cy.clearAppData();
    cy.visit("/");
    cy.waitForGraph();
  });

  it("should add a new person, edit their parents, and delete the new person", () => {
    // Graph: check that Cyprian is not in the graph
    cy.get('[data-cy="genealogy-graph"] svg')
      .contains("text", "Cyprian")
      .should("not.exist");

    // Add Person Dialog: Cyprian
    cy.get('[data-cy="add-person-button"]').click(); // Open the dialog to add a new person
    cy.get('[data-cy="edit-dialog"]', {timeout: 1000}).should("be.visible");
    cy.get('[data-cy="edit-dialog"] input#person-name')
      .clear()
      .type("Cyprian");
    cy.get('[data-cy="edit-dialog"] form').submit(); // Submit the form and close the dialog

    cy.get('[data-cy="edit-dialog"]', {timeout: 1000}).should(
      "not.be.visible"
    );

    // Graph: check that Cyprian is in the graph
    cy.get('[data-cy="genealogy-graph"] svg', {timeout: 1000})
      .contains("text", "Cyprian")
      .should("exist");

    // Edit Person Dialog: add parents and info
    cy.get('[data-cy="genealogy-graph"] svg', {timeout: 1000})
      .contains("text", "Cyprian")
      .parent("a")
      .click(); // Instead of clicking the text node, click the parent <a> element if it exists
    cy.get('[data-cy="edit-dialog"]', {timeout: 5000}).should("be.visible");
    cy.get('[data-cy="edit-dialog"] input#person-name').should(
      "have.value",
      "Cyprian"
    );
    cy.wait(50); // Wait - workaround for the loss of "Cyprian" in the input#person-name field
    cy.get('[data-cy="edit-dialog"] [data-cy="father-input"]')
      .clear()
      .type("Father of Cyprian");
    cy.get('[data-cy="edit-dialog"] [data-cy="mother-input"]')
      .clear()
      .type("Mother of Cyprian");
    cy.get('[data-cy="edit-dialog"] [data-cy="info-input"]')
      .clear()
      .type("Cyprress Tester");
    cy.get('[data-cy="edit-dialog"] form').submit(); // Submit the form and close the dialog

    cy.get('[data-cy="edit-dialog"]', {timeout: 5000}).should(
      "not.be.visible"
    );

    // Graph: check that the parents are added to the graph
    cy.get('[data-cy="genealogy-graph"] svg')
      .contains("text", "Father of Cyprian")
      .should("exist");
    cy.get('[data-cy="genealogy-graph"] svg')
      .contains("text", "Mother of Cyprian")
      .should("exist");
    cy.get('[data-cy="genealogy-graph"] svg')
      .contains("text", "Cyprress Tester")
      .should("exist");

    // Edit Person Dialog: remove Cyprian
    cy.get('[data-cy="genealogy-graph"] svg')
      .contains("text", "Cyprian")
      .parent("a")
      .click(); // Click the parent <a> element to open the edit dialog
    cy.get('[data-cy="edit-dialog"]', {timeout: 5000}).should("be.visible");
    cy.get('[data-cy="edit-dialog"] input#person-name').should(
      "have.value",
      "Cyprian"
    );
    cy.get('[data-cy="edit-dialog"] [data-cy="remove-button"]').click();
    cy.get('[data-cy="edit-dialog"]', {timeout: 5000}).should(
      "not.be.visible"
    );

    // Graph: check that Cyprian is removed from the graph (robust exact match)
    cy.get('[data-cy="genealogy-graph"] svg text').should(($nodes) => {
      const names = $nodes.toArray().map((el) => el.textContent.trim());
      expect(names).not.to.include("Cyprian");
    });
  });

  it("opens the edit dialog and validates fields", () => {
    // Open the edit dialog by clicking the first person node in the SVG graph
    // cy.get('[data-cy="genealogy-graph"] svg text')
    //   .first()
    //   .parent('a')
    //   .click();
    cy.get('[data-cy="genealogy-graph"] svg a text').first().click();
    cy.get('[data-cy="edit-dialog"]').should("be.visible");

    // Check initial values
    cy.get("#person-name").should("have.value", "Chloé Rochat Favre");

    // Validation: empty name
    cy.get("#person-name").clear().should("have.value", "");
    cy.wait(50);
    cy.get("#save-button").should("be.disabled");
    cy.get("#name-error").should("contain", "required");

    // Validation: long name
    cy.get("#person-name").type("a".repeat(120));
    cy.wait(50);
    cy.get("#save-button").should("be.enabled");
    cy.get("#person-name").invoke("val").should("have.length", 100);

    // Edit and save
    cy.get("#person-name").clear().type("New Name");
    cy.get("#save-button").click();
    cy.get('[data-cy="edit-dialog"]').should("not.be.visible");
    cy.contains("New Name"); // Check UI updated

    // Remove person
    cy.get('[data-cy="genealogy-graph"] svg text')
      .last()
      .parent("a")
      .click();
    cy.get("#remove-button").click();
    cy.on("window:confirm", () => true);
    cy.get('[data-cy="edit-dialog"]').should("not.be.visible");
    // Optionally assert person is removed from UI
  });
});
