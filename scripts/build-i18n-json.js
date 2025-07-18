import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const srcDir = path.join(__dirname, "../src/i18n"); // for tsconfig
const distDir = path.join(__dirname, "../ts-dist/i18n"); // for compiled JS
const outDir = path.join(__dirname, "../public/i18n");

function runTSC() {
  try {
    console.log("Running tsc to transpile TypeScript...");
    execSync(`npx tsc --project ${srcDir}/tsconfig.i18n.json`, {
      stdio: "inherit",
      cwd: path.join(__dirname, ".."),
    });
  } catch (err) {
    console.error("TypeScript compilation failed:", err);
    process.exit(1);
  }
}

async function extractTranslations() {
  const indexPath = path.join(distDir, "index.js");
  if (!fs.existsSync(indexPath)) {
    throw new Error(
      `index.js not found at ${indexPath}. Please check the TypeScript compilation.`
    );
  }
  const mod = await import(indexPath + "?t=" + Date.now());
  return mod.translations;
}

async function main() {
  runTSC();

  // Copy compiled translation JS files to public/i18n/translations
  const srcTranslationsDir = path.join(distDir, 'translations');
  const destTranslationsDir = path.join(outDir, 'translations');
  if (!fs.existsSync(destTranslationsDir)) {
    fs.mkdirSync(destTranslationsDir, { recursive: true });
  }
  if (fs.existsSync(srcTranslationsDir)) {
    for (const file of fs.readdirSync(srcTranslationsDir)) {
      if (file.endsWith('.js')) {
        fs.copyFileSync(
          path.join(srcTranslationsDir, file),
          path.join(destTranslationsDir, file)
        );
        console.log(`Copied: ${file} to public/i18n/translations/`);
      }
    }
  } else {
    console.warn('No compiled translations found to copy.');
  }
  // Example client-side usage:
  // const { en } = await import('/i18n/translations/en.js');
}

main();
