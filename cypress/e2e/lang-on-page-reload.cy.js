// cypress/e2e/lang-on-page-reload.cy.test.js

describe("Language select on page reload", () => {
  const appUrl = "/";

  it("should display the language selector", () => {
    cy.visit(appUrl);
    cy.get("[data-cy=language-select]").should("exist"); // LanguageSwitcher language selector
    cy.get("[data-cy=language-select]").should("have.value", "en");
    cy.title().should("eq", "Family Tree Explorer"); // Page title in the browser tab
  });

  it("should persist after reload the language change", () => {
    cy.visit(appUrl);

    // Select a different language (e.g., 'fr' for French)
    cy.get("[data-cy=language-select]").select("fr");

    cy.get("[data-cy=language-select]").should("have.value", "fr"); // LanguageSwitcher

    cy.get("[data-cy=app-title]") // Header app title
      .invoke("text")
      .should("eq", "Explorateur d'Arbre Familial");

    cy.get("[data-cy=add-person-button]") // A Toolbar button
      .invoke("text")
      .should("eq", "Ajouter Personne");

    cy.get("[data-cy=project-title]") // Footer project title
      .invoke("text")
      .should("match", /^Application Généalogique/);

    // Reload the page
    cy.reload();

    // Language selector should still show 'fr'
    cy.get("[data-cy=language-select]").should("have.value", "fr");

    cy.get("[data-cy=add-person-button]") // A Toolbar button
      .invoke("text")
      .should("eq", "Ajouter Personne");
  });
});

describe("Language selector persistence", () => {
  const appUrl = "/";

  it("should default to English on first load", () => {
    cy.visit(appUrl);
    cy.get("[data-cy=language-select]").should("exist").and("have.value", "en");
    cy.get("[data-cy=app-title]") // Header app title
      .invoke("text")
      .should("eq", "Family Tree Explorer");
  });

  it("should follow the url parameter to enforce a different language", () => {
    cy.visit(`${appUrl}?lang=de`);
    cy.get("[data-cy=language-select]").should("exist").and("have.value", "de");
    cy.get("[data-cy=app-title]") // Header app title
      .invoke("text")
      .should("eq", "Stammbaum Explorer");
  });

  it("should switch back to English and persist", () => {
    cy.visit(appUrl);
    cy.get("[data-cy=language-select]").select("en");
    cy.get("[data-cy=language-select]").should("have.value", "en");
    cy.get("[data-cy=app-title]") // Header app title
      .invoke("text")
      .should("eq", "Family Tree Explorer");
    cy.reload();
    cy.get("[data-cy=language-select]").should("have.value", "en");
     cy.get("[data-cy=app-title]") // Header app title
       .invoke("text")
       .should("eq", "Family Tree Explorer");
  });
});
