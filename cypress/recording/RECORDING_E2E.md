# Cypress Test Generation from Chrome Recorder

This project supports a workflow for generating Cypress end-to-end tests using Chrome's built-in Recorder tool.

## Workflow

1. **Record User Actions in Chrome**
   - Open Chrome DevTools and go to the "Recorder" tab.
   - Record your user flow by interacting with your site.
   - Export the recording as a JSON file.

2. **Convert JSON to Cypress Test**
   - Use the provided conversion script to transform the exported JSON into a Cypress `.cy.js` test file.
   - Example:
     ```sh
     node scripts/convert-recorder-json-to-cy.js path/to/recording.json > cypress/e2e/generated-test.cy.js
     ```

3. **Run the Cypress Test**
   - Run your generated test with Cypress:
     ```sh
     npx cypress run --spec cypress/e2e/generated-test.cy.js
     ```
   - Or open the Cypress UI to run and debug:
     ```sh
     npx cypress open
     ```

## Notes

- The conversion script parses the Chrome Recorder JSON and outputs Cypress test code.
- You can further edit and enhance the generated `.cy.js` file as needed.
- See `cypress.config.js` for Cypress configuration details.

---
