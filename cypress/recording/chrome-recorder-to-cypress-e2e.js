#!/usr/bin/env node

import fs from 'fs';

function convertToCypress(recordingPath) {
  const recording = JSON.parse(fs.readFileSync(recordingPath, 'utf8'));

  let cypressCode = `describe('${recording.title || 'Recorded Test'}', () => {
  it('${recording.title || 'user workflow'}', () => {\n`;

  recording.steps.forEach(step => {
    switch(step.type) {
      case 'navigate':
        // Convert full URL to relative path for Cypress
        const url = step.url.replace(/https?:\/\/[^\/]+/, '');
        cypressCode += `    cy.visit('${url || '/'}')\n`;
        break;

      case 'click':
        const clickSelector = getBestSelector(step.selectors);
        cypressCode += `    cy.get('[data-testid="${clickSelector}"]').click()\n`;
        break;

      case 'change':
        const changeSelector = getBestSelector(step.selectors);
        cypressCode += `    cy.get('[data-testid="${changeSelector}"]').clear().type('${step.value}')\n`;
        break;

      case 'keyDown':
        if (step.key === 'Enter') {
          cypressCode += `    cy.get('body').type('{enter}')\n`;
        }
        break;

      case 'waitForElement':
        const waitSelector = getBestSelector(step.selectors);
        cypressCode += `    cy.get('[data-testid="${waitSelector}"]').should('be.visible')\n`;
        break;

      default:
        cypressCode += `    // TODO: Handle ${step.type} step\n`;
    }
  });

  cypressCode += `  })
})`;

  // Write to cypress test file
  const outputPath = recordingPath.replace('.json', '.cy.js');
  fs.writeFileSync(outputPath, cypressCode);

  console.log(`✅ Converted to Cypress test: ${outputPath}`);
  console.log('\n📝 Remember to:');
  console.log('- Add proper data-cy attributes to your elements');
  console.log('- Add assertions to verify expected behavior');
  console.log('- Clean up selectors for better maintainability');
}

function getBestSelector(selectors) {
  // Prefer data attributes, then IDs, then classes, then element selectors
  if (!selectors || !selectors.length) return 'body';

  for (let selectorArray of selectors) {
    for (let selector of selectorArray) {
      if (selector.includes('[data-')) return selector.match(/data-[^=]+/)[0];
      if (selector.includes('#')) return selector.substring(1);
    }
  }

  // Fallback to first selector
  return selectors[0][0];
}

// Run the converter
if (process.argv.length < 3) {
  console.log('Usage: cypress-chrome-recorder-out-to-cy.js <recording.json>');
  console.log('\nTo create a recording:');
  console.log('1. Open your interactive website in the Chrome browser');
  console.log('2. Open Chrome DevTools (F12 or Cmd+Option+I on Mac)');
  console.log('3. Go to the "Recorder" tab (under the "More Tools" menu)');
  console.log('4. Click "Start new recording" and perform your actions');
  console.log('5. Click "End recording" when finished');
  console.log('6. Click the "Export" button and choose "Export as JSON"');
  console.log('7. Save the JSON file and use its path as the argument for this script');

  process.exit(1);
}

convertToCypress(process.argv[2]);

convertToCypress(process.argv[2]);
