# Cypress Testing Setup

This project uses [Cypress](https://cypress.io) for end-to-end (E2E) testing of the genealogy application.

## Installation

Cypress is already installed as a dev dependency. If you need to reinstall:

```bash
npm install --save-dev cypress start-server-and-test
```

## Test Structure

```
cypress/
├── e2e/                    # End-to-end tests
│   ├── homepage.cy.js      # Homepage functionality tests
│   ├── language-switcher.cy.js  # Language switching tests
│   ├── graph-interaction.cy.js  # Graph interaction tests
│   ├── file-management.cy.js    # File upload/download tests
│   └── responsive-design.cy.js  # Responsive design tests
├── fixtures/               # Test data
│   └── sample_tree.json    # Sample genealogy data
├── support/                # Support files and custom commands
│   ├── commands.js         # Custom Cypress commands
│   ├── e2e.js             # E2E test setup
│   └── component.js       # Component test setup
└── cypress.config.js       # Cypress configuration
```

## Available Scripts

### Run Tests Interactively

```bash
npm run test:e2e:open
```

Opens the Cypress Test Runner for interactive test development.

### Run Tests Headless

```bash
npm run test:e2e
```

Runs all tests in headless mode (CI-friendly).

### Run Tests with Dev Server

```bash
npm run test:e2e:dev
```

Starts the development server and opens Cypress (recommended for development).

### Run Tests in CI Mode

```bash
npm run test:e2e:ci
```

Starts the dev server and runs tests headlessly (perfect for CI/CD).

## Custom Commands

The project includes several custom Cypress commands for testing genealogy-specific functionality:

### `cy.loadTestData(dataFile)`

Loads test data into the application's local storage.

```javascript
cy.loadTestData("sample_tree.json");
```

### `cy.clearAppData()`

Clears all application data from local and session storage.

```javascript
cy.clearAppData();
```

### `cy.waitForGraph()`

Waits for the genealogy graph to be rendered and visible.

```javascript
cy.waitForGraph();
```

### `cy.selectLanguage(language)`

Switches the application language.

```javascript
cy.selectLanguage("fr"); // Switch to French
```

### `cy.getUIMode()`

Returns the current UI mode ('forest' or 'one-tree').

```javascript
cy.getUIMode().then((mode) => {
  cy.log(`Current mode: ${mode}`);
});
```

### `cy.setUIMode(mode)`

Programmatically sets the UI mode and reloads the page.

```javascript
cy.setUIMode("forest"); // Set to forest mode
cy.setUIMode("one-tree"); // Set to one-tree mode
```

### `cy.ensureForestMode()`

Ensures the application is in forest mode (where tree and file managers are visible).

```javascript
cy.ensureForestMode(); // Switches to forest mode if not already there
```

### `cy.ensureOneTreeMode()`

Ensures the application is in one-tree mode (where tree and file managers are hidden).

```javascript
cy.ensureOneTreeMode(); // Switches to one-tree mode if not already there
```

## Test Categories

### 1. Homepage Tests (`homepage.cy.js`)

- Basic page loading
- Header and footer visibility
- Graph rendering
- Overall layout validation

### 2. Language Switcher Tests (`language-switcher.cy.js`)

- Language selection functionality
- Content translation verification
- Language persistence across reloads

### 3. Graph Interaction Tests (`graph-interaction.cy.js`)

- Node and edge rendering
- Click interactions with person nodes
- Zoom and pan functionality
- Person information display

### 4. File Management Tests (`file-management.cy.js`)

- File upload functionality
- Data export/import
- File manager dialog interactions
- UI mode conditional testing (one-tree vs forest mode)

### 5. UI Mode Switching Tests (`mode-switching.cy.js`)

- Mode toggling between one-tree and forest modes
- UI element visibility based on current mode
- Mode persistence across page reloads
- Programmatic mode setting

### 6. Responsive Design Tests (`responsive-design.cy.js`)

- Mobile, tablet, and desktop layouts
- Navigation accessibility across viewports
- Graph rendering at different screen sizes

## Configuration

The Cypress configuration is in `cypress.config.js`:

- **Base URL**: `http://localhost:4321` (Astro dev server)
- **Viewport**: 1280x720 (default)
- **Video Recording**: Enabled for test runs
- **Screenshots**: Enabled on test failure

## Best Practices

### 1. Use Data Attributes

Add `data-testid` attributes to elements for reliable selection:

```html
<button data-testid="save-button">Save</button>
```

### 2. Wait for Async Operations

Use custom commands like `cy.waitForGraph()` or explicit waits:

```javascript
cy.get('[data-testid="graph"]', {timeout: 10000}).should("be.visible");
```

### 3. Clean State Between Tests

Each test starts with `cy.clearAppData()` to ensure isolation.

### 4. Use Fixtures for Test Data

Store test data in `cypress/fixtures/` and load it with `cy.loadTestData()`.

## Debugging Tests

### 1. Interactive Mode

Use `npm run test:e2e:open` to debug tests interactively with the Cypress Test Runner.

### 2. Video and Screenshots

Failed tests automatically capture screenshots. Videos are recorded for all test runs.

### 3. Browser Developer Tools

In interactive mode, you can open browser dev tools to inspect the application state.

## CI/CD Integration

For GitHub Actions or other CI systems, use:

```bash
npm run test:e2e:ci
```

This command:

1. Starts the Astro development server
2. Waits for it to be available
3. Runs all Cypress tests headlessly
4. Stops the server when done

## Troubleshooting

### Graph Not Loading

If graph tests fail, ensure:

- The genealogy data is properly loaded
- SVG elements are being rendered
- JavaScript is executing without errors

### Timeout Issues

Increase timeouts in `cypress.config.js` if tests are timing out:

```javascript
defaultCommandTimeout: 10000,
requestTimeout: 10000,
responseTimeout: 10000
```

### Flaky Tests

- Add explicit waits for async operations
- Use `cy.intercept()` to mock API calls if needed
- Ensure proper test isolation with `cy.clearAppData()`
