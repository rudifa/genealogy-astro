describe('Responsive Design', () => {
  const viewports = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1280, height: 720 },
    { name: 'large-desktop', width: 1920, height: 1080 }
  ];

  viewports.forEach(viewport => {
    context(`${viewport.name} viewport (${viewport.width}x${viewport.height})`, () => {
      beforeEach(() => {
        cy.clearAppData();
        cy.loadTestData('sample_tree.json');
        cy.viewport(viewport.width, viewport.height);
        cy.visit('/');
      });

      it('should display properly', () => {
        cy.get('main').should('be.visible');
        cy.get('header').should('be.visible');
        cy.get('footer').should('be.visible');
      });

      it('should have accessible navigation', () => {
        cy.get('[data-testid="toolbar"]').should('be.visible');
        cy.get('[data-testid="language-switcher"]').should('be.visible');
      });

      it('should render the graph appropriately', () => {
        cy.waitForGraph();
        cy.get('svg').should('be.visible');

        // Check that the SVG doesn't overflow its container
        cy.get('[data-testid="genealogy-graph"]').within(() => {
          cy.get('svg').should('be.visible');
        });
      });

      if (viewport.width < 768) {
        it('should adapt toolbar for mobile', () => {
          // On mobile, some elements might be collapsed or differently arranged
          cy.get('[data-testid="toolbar"]').should('be.visible');
        });
      }
    });
  });
});
