/// <reference types="cypress" />

const languages = [
  {code: "en", title: "Family Tree Explorer", footer: "Developed by @rudifa"},
  {
    code: "fr",
    title: "Explorateur d'Arbre Familial",
    footer: "Développé par @rudifa",
  },
  {code: "de", title: "Stammbaum Explorer", footer: "Entwickelt von @rudifa"},
];

languages.forEach(({ code, title, footer }) => {
  describe(`Header and Footer in ${code}`, () => {
    beforeEach(() => {
      cy.window().then(win => {
        win.localStorage.setItem('genealogy-language', code);
      });
      cy.visit('/');
    });

    it('should display the Header', () => {
      cy.get('header').should('exist');
      cy.get('h1.app-title').should('have.text', title);
    });

    it('should display the Footer', () => {
      cy.get('footer.app-footer').should('exist');
      cy.get('footer.app-footer').should('include.text', footer);
    });
  });
});
