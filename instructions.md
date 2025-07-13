# Instructions for GitHub Copilot

## Project Overview

- This is a genealogy app built with Astro.
- Node tests are located in the `test/` folder, Vitest tests in `vitest/` and Cypress e2e tests in `e2e/` folder.

## Test Migration & Refactoring

- Ensure imports use correct relative paths and file extensions.
- Fix any syntax errors, such as missing parentheses or stray semicolons.
- Remove unused variables and unneeded async/await.

## Running Tests

- Use `npm run test` to run all tests.
- Use `npm run  test
- Use `npm run vitest` for vitest tests.
- Use `npm run test:e2e` for Cypress E2E tests.

## Code Style

- Follow the established coding conventions and best practices for Astro.
- Use comments for explanations, not custom matcher messages.

## Task Execution

- When asked to run tests, use the appropriate npm script.
- When editing files, only change what is requested.
- Always confirm changes and offer to run tests after edits.

## Error Handling

- If a syntax or import error is detected, locate and fix the exact line.
- If a test fails, provide a clear explanation and suggest a fix.

## Communication

- Be concise and direct.
- Only make changes requested by the user.
- Confirm when a task is complete and ask if further help is needed.
