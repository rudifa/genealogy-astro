describe('Genealogy Graph Interaction', () => {
  beforeEach(() => {
    cy.clearAppData();
    cy.visit('/');
    cy.waitForGraph();
  });

  it('should render the graph with nodes and edges', () => {
    cy.get('svg').within(() => {
      // Check for nodes (typically represented as circles or rectangles)
      cy.get('g[class*="node"], circle, rect').should('have.length.at.least', 1);

      // Check for edges/connections (typically represented as paths or lines)
      cy.get('path, line').should('have.length.at.least', 1);
    });
  });

  it('should allow clicking on person nodes', () => {
    cy.get('svg').within(() => {
      // Find and click on the first clickable node
      cy.get('g[class*="node"], circle, rect').first().click();
    });

    // Check if person info dialog or details appear
    cy.get('[data-cy="person-info"], [class*="person-info"], [class*="dialog"]').should('be.visible');
  });

  it('should not zoom when wheel event is triggered', () => {
    cy.get('[data-cy="genealogy-graph"] svg').should('be.visible');
    cy.wait(200); // Wait for any rendering changes
    cy.get('[data-cy="genealogy-graph"] svg').invoke('attr', 'viewBox').then((before) => {
      cy.get('[data-cy="genealogy-graph"] svg').trigger('wheel', { deltaY: -100 });
      cy.wait(200);
      cy.get('[data-cy="genealogy-graph"] svg').invoke('attr', 'viewBox').should('eq', before);
    });
  });

  it('should not pan when mouse drag is triggered', () => {
    cy.get('[data-cy="genealogy-graph"] svg').should('be.visible');
    cy.wait(200);
    cy.get('[data-cy="genealogy-graph"] svg').invoke('attr', 'viewBox').then((before) => {
      cy.get('[data-cy="genealogy-graph"] svg')
        .trigger('mousedown', { clientX: 100, clientY: 100 })
        .trigger('mousemove', { clientX: 200, clientY: 200 })
        .trigger('mouseup');
      cy.wait(200);
      cy.get('[data-cy="genealogy-graph"] svg').invoke('attr', 'viewBox').should('eq', before);
    });
  });

  it('should display person names in the graph', () => {
    cy.get('svg').within(() => {
      // Look for text elements that should contain person names
      cy.get('text').should('have.length.at.least', 1);
      cy.get('text').first().should('not.be.empty');
    });
  });
});
