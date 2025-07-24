// cypress/e2e/lang-on-page-reload.cy.test.js

describe('Language select on page reload', () => {
    const appUrl = '/'; // Change if your app's root URL is different

    it('should display the language selector', () => {
        cy.visit(appUrl);
        cy.get('[data-cy=language-select]').should('exist');
    });

    it('should change language and persist after reload', () => {
      cy.visit(appUrl);

      // Select a different language (e.g., 'fr' for French)
      cy.get("[data-cy=language-select]").select("fr");

      cy.get("[data-cy=language-select]").should("have.value", "fr");
      cy.get("[data-cy=app-title]")
        .invoke("text")
        .should("match", /^Explorateur/);
      cy.get("[data-testid=add-person-button]")
        .invoke("text")
        .should("eq", "Ajouter Personne");

      // expect at data-cy='project-title' to start with 'Application Généalogique'
      cy.get("[data-cy=project-title]")
        .invoke("text")
        .should("match", /^Application Généalogique/);


          // Reload the page
          cy.reload();

          // Language selector should still show 'fr'
          cy.get('[data-cy=language-select]').should('have.value', 'fr');

      //     // The text should still be in French
      //     cy.get('[data-cy=welcome-text]').should('contain', 'Bienvenue');
    });
});
// describe('Language selector persistence', () => {
//     const appUrl = '/';

//     it('should default to English on first load', () => {
//         cy.visit(appUrl);
//         cy.get('[data-cy=language-select]').should('exist').and('have.value', 'en');
//         cy.get('[data-cy=welcome-text]').should('contain', 'Welcome');
//     });

//     it('should persist selected language after reload', () => {
//         cy.visit(appUrl);
//         cy.get('[data-cy=language-select]').select('fr');
//         cy.get('[data-cy=welcome-text]').should('contain', 'Bienvenue');
//         cy.reload();
//         cy.get('[data-cy=language-select]').should('have.value', 'fr');
//         cy.get('[data-cy=welcome-text]').should('contain', 'Bienvenue');
//     });

//     it('should switch back to English and persist', () => {
//         cy.visit(appUrl);
//         cy.get('[data-cy=language-select]').select('en');
//         cy.get('[data-cy=welcome-text]').should('contain', 'Welcome');
//         cy.reload();
//         cy.get('[data-cy=language-select]').should('have.value', 'en');
//         cy.get('[data-cy=welcome-text]').should('contain', 'Welcome');
//     });
// });
