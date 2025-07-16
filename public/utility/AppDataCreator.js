// AppDataCreator.js
// Loads the sample tree JSON and ensures window.appData exists and is initialized
import {AppData} from "./AppData.js";
import {getSampleFamily} from "./SampleFamily.js";

/**
 * Ensures that a global AppData instance exists on window, creating and initializing it if necessary.
 *
 * Typical usage:
 *   import { appDataEnsureExists } from "/utility/AppDataCreator.js";
 *   const appData = appDataEnsureExists();
 *   // Now you can use appData for state management and tree operations
 *
 * @returns {AppData} The existing or newly created AppData instance attached to window.appData
 */
export function appDataEnsureExists() {
  if (!window.appData) {
    window.appData = new AppData("en");

    const sampleFamily = getSampleFamily();
    console.log("sampleFamily:", sampleFamily);

    window.appData.initialize(sampleFamily, null); // null translations
    console.log(
      "🦋 appDataEnsureExists: window.appData created and initialized with sample tree data"
    );
  } else {
    console.log("☘️ appDataEnsureExists: window.appData exists");
  }
  return window.appData; // return the existing or newly created appData instance
}
