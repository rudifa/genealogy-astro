// AppDataLoader.js
// Loads the sample tree JSON and ensures window.appData exists and is initialized
import {AppData} from "./AppData.js";
import {getSampleFamily} from "./SampleFamily.js";

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
