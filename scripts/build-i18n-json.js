// scripts/build-i18n-json.mjs
// ESM-compatible script to extract translations from src/i18n and write JSON files to public/i18n
// Run with: node scripts/build-i18n-json.mjs

import fs from "fs";
import path from "path";
import {fileURLToPath} from "url";
import {execSync} from "child_process";
// Run tsc to transpile TS to JS in src/i18n
function runTSC() {
  try {
    console.log("Running tsc to transpile TypeScript...");
    execSync("npx tsc --project src/i18n/tsconfig.i18n.json", {
      stdio: "inherit",
    });
  } catch (err) {
    console.error("TypeScript compilation failed:", err);
    console.error("Error details:", err.message);
    process.exit(1);
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const i18nIndex = path.join(__dirname, "../ts-dist/i18n/index.js");
const outDir = path.join(__dirname, "../public/i18n");

async function extractTranslations() {
  // Dynamically import the compiled JS version of index.ts
  if (!fs.existsSync(i18nIndex)) {
    throw new Error(
      "src/i18n/index.js not found. Please build/transpile your TS files to JS first."
    );
  }
  const mod = await import(i18nIndex + "?t=" + Date.now());
  return mod.translations;
}

async function main() {
  runTSC();
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, {recursive: true});
  }
  const translations = await extractTranslations();
  for (const [lang, data] of Object.entries(translations)) {
    const outFile = path.join(outDir, `${lang}.json`);
    fs.writeFileSync(outFile, JSON.stringify(data, null, 2), "utf-8");
    console.log(`Wrote: ${outFile}`);
  }
}

main();
