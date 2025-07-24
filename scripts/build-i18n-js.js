// scripts/build-i18n-js.js
// ESM-compatible script to translate from src/i18n .ts file into corresponding .js files
// This script
// - should be run from project root
// - should use src/i18n/tsconfig.i18n.json
// - should compile all .ts files under src/i18n into corresponding .js files
//   and deposit them under /public/i18n
// Run with: node scripts/build-i18n-js.js

import {execSync} from "child_process";
import fs from "fs";
import path from "path";

// --- Configuration ---
const outputDir = path.resolve("public", "i18n");
const tsconfigPath = path.resolve("src", "i18n", "tsconfig.i18n.json");

// Function to clean the output directory
function clean() {
  console.log(`Cleaning directory: ${outputDir}`);
  if (fs.existsSync(outputDir)) {
    fs.rmSync(outputDir, {recursive: true, force: true});
    console.log("Directory cleaned successfully.");
  } else {
    console.log("Directory does not exist, nothing to clean.");
  }
}

// Run tsc to transpile TS to JS
function runTSC() {
  try {
    const command = `npx tsc --project ${tsconfigPath}`;
    console.log("\nRunning tsc to transpile TypeScript...");
    console.log(command);
    execSync(command, {stdio: "inherit"});
    console.log("\nTypeScript compilation successful.");
    console.log(`JavaScript files have been generated in ${outputDir}`);
    console.log("tree public/i18n");
    try {
      execSync("tree public/i18n", {stdio: "inherit"});
    } catch (err) {
      // Silently skip if 'tree' command is not installed
    }
  } catch (err) {
    console.error(
      "\nTypeScript compilation failed. Please check the errors above."
    );
    process.exit(1);
  }
}

function main() {
  clean();
  runTSC();
}

main();
