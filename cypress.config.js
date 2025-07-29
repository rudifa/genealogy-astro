import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:4321",
    supportFile: "cypress/support/e2e.js",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    experimentalStudio: true,
  },
  component: {
    devServer: {
      framework: "astro",
      bundler: "vite",
    },
    supportFile: "cypress/support/component.js",
    specPattern: "cypress/component/**/*.cy.{js,jsx,ts,tsx}",
  },
});
