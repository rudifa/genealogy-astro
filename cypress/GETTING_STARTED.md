# Getting Started with Cypress Testing

## Quick Start

1. **Start the development server:**

   ```bash
   npm run dev
   ```

2. **Open Cypress in interactive mode (recommended for development):**

   ```bash
   npm run test:e2e:open
   ```

3. **Or run tests headlessly (for CI/automation):**
   ```bash
   npm run test:e2e
   ```

## Example Test Run

To run all tests with the dev server automatically started:

```bash
npm run test:e2e:dev
```

This will:

- Start the Astro development server
- Wait for it to be available on http://localhost:4321
- Open the Cypress Test Runner
- Allow you to run tests interactively

## Current Test Coverage

✅ **Homepage Tests** - Basic page loading and layout validation
✅ **Language Switcher** - Multi-language support testing
✅ **File Management** - Toolbar and action buttons
✅ **Graph Interaction** - Graph rendering and interactions
✅ **Responsive Design** - Multiple viewport testing

## Adding New Tests

1. Create a new `.cy.js` file in `cypress/e2e/`
2. Use the custom commands provided in `cypress/support/commands.js`
3. Add appropriate `data-testid` attributes to your components
4. Follow the existing test patterns

## Best Practices Implemented

- **Data attributes for reliable element selection**
- **Custom commands for genealogy-specific actions**
- **Clean state between tests**
- **Responsive design testing**
- **Proper async handling with waits**
- **Video recording and screenshots for debugging**

## Test Data

Sample genealogy data is available in `cypress/fixtures/sample_tree.json` and can be loaded using:

```javascript
cy.loadTestData("sample_tree.json");
```

Happy testing! 🎯
