/// <reference types="cypress" />
const LS_KEY = "app-language-storage-key";

const languages = [
  {code: "en", title: "Family Tree Explorer", footer: "Developed by @rudifa"},
  {
    code: "fr",
    title: "Explorateur d'Arbre Familial",
    footer: "Développé par @rudifa",
  },
  {code: "de", title: "Stammbaum Explorer", footer: "Entwickelt von @rudifa"},
];

describe("Header and Footer", () => {
  languages.forEach(({code, title, footer}) => {
    describe(`in ${code}`, () => {
      beforeEach(() => {
        cy.window().then((win) => {
          win.localStorage.setItem(LS_KEY, code);
        });
        cy.visit("/");
      });

      it("should display the Header", () => {
        cy.get("header").should("exist");
        cy.get("h1.app-title").should("have.text", title);
      });

      it("should display the Footer", () => {
        cy.get("footer.app-footer").should("exist");
        cy.get("footer.app-footer").should("include.text", footer);
      });
    });
  });

  it("should update texts when user changes language via selector", () => {
    cy.visit("/");

    // Start with default (en)
    cy.get("h1.app-title").should("have.text", languages[0].title);
    cy.get("footer.app-footer").should("include.text", languages[0].footer);

    // Loop through other languages and test UI updates
    languages.slice(1).forEach(({code, title, footer}) => {
      cy.get("[data-cy='language-select']").select(code);
      cy.get("h1.app-title").should("have.text", title);
      cy.get("footer.app-footer").should("include.text", footer);
    });
  });
});
