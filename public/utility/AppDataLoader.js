// AppDataLoader.js
// Loads the sample tree JSON and ensures window.appData exists and is initialized
import { AppData } from "./AppData.js";

export async function loadSampleTree() {
  const response = await fetch('/utility/data/sample_tree.json');
  if (!response.ok) throw new Error('Failed to load sample_tree.json');
  return await response.json(); // parsed object
  // or: return await response.text(); // as string
}

export async function appDataEnsureExists() {
  let created = false;
  if (!window.appData) {
    window.appData = new AppData("en");
    created = true;
  }
  if (created) {
    const initialTreeData = await loadSampleTree();
    window.appData.initialize(initialTreeData);
  }
  return window.appData;
}
