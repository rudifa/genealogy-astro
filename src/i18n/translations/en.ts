import type {Translations} from "../index";

export const en: Translations = {
  // Page content
  pageTitle: "Family Tree Explorer",
  pageDescription:
    "Interactive family tree visualization and genealogy management application.",

  // Header
  appTitle: "Family Tree Explorer",
  appSubtitle:
    "Visualize and manage your family genealogy with an interactive graph. Click on any person to edit their details or add new family members.",

  // Toolbar
  addPerson: "Add Person",
  clearAll: "Clear All",
  familyExample: "Family Example",
  manageTrees: "Manage Trees",
  loading: "Loading...",

  // Dialog
  editPerson: "Edit Person",
  addNewPerson: "Add New Person",
  name: "Name",
  mother: "Mother",
  father: "Father",
  required: "*",
  save: "Save",
  remove: "Remove",
  cancel: "Cancel",

  // Validation messages
  nameRequired: "Name is required",
  nameMaxLength: "Name must be 100 characters or less",
  nameExists: "A person with this name already exists",
  parentMaxLength: "name must be 100 characters or less",
  parentSameAsPerson: "cannot be the same as the person",
  fixErrors: "Please fix the validation errors before saving",

  // Notifications
  graphUpdated: "Graph updated",
  graphCleared: "Graph cleared",
  noDataToClear: "No data to clear",
  familyExampleLoaded: "Family example loaded",
  personNotFound: "not found",
  errorRendering: "Failed to render graph",
  errorUpdating: "Failed to update graph",
  errorSaving: "An error occurred while saving. Please try again.",
  errorRemoving:
    "An error occurred while removing the person. Please try again.",
  errorOpening: "Error opening person details",
  errorClearing: "Error clearing genealogy data",
  errorInitializing: "Failed to initialize genealogy graph",

  // Confirmations
  confirmRemove:
    "Are you sure you want to remove {name}? This action cannot be undone.",
  confirmClear:
    "Are you sure you want to remove all {count} {people} from the genealogy? This action cannot be undone.",
  confirmFamilyExample:
    "Are you sure you want to load the family example? This will replace your current data and cannot be undone.",
  confirmResetFamilyExample:
    "Are you sure you want to reset the Family Example tree to its original state? This will replace all current data.",
  confirmLoadFamilyExample:
    'Are you sure you want to load the family example data into the "{treeName}" tree? This will replace all current data.',
  actionCannotBeUndone: "This action cannot be undone.",

  // Placeholders and misc
  loadingGraph: "Loading genealogy graph...",
  reloadPage: "Reload Page",
  initializationError: "Initialization Error",
  failedToLoad: "Failed to load the genealogy graph application.",
  errorRenderingGraph: "Error Rendering Graph",

  // Language switcher
  language: "Language",
  selectLanguage: "Select Language",

  // Tree Management Dialog
  manageFamilyTrees: "Manage Family Trees",
  availableTrees: "Available Trees:",
  createNewTree: "Create New Tree:",
  copyCurrentTreeData: "Copy current tree data",
  create: "Create",
  enterTreeName: "Enter tree name...",
  currentActiveTree: "Current active tree",
  switchToTree: "Switch to this tree",
  deleteTree: "Delete this tree",
  confirmDeleteTree:
    'Are you sure you want to delete the tree "{name}"? This action cannot be undone.',
  enterTreeNamePrompt: "Please enter a tree name",
  failedToSwitchTree: "Failed to switch to tree",
  failedToDeleteTree: "Failed to delete tree",
  failedToCreateTree: "Failed to create tree",
  errorSwitchingTree: "Error switching to tree: {error}",
  errorDeletingTree: "Error deleting tree: {error}",
  errorCreatingTree: "Error creating tree: {error}",

  // Footer
  projectInfo: "Open Source Genealogy App",
  developedBy: "Developed by",
  sourceCode: "Source Code",
  viewOnGitHub: "View on GitHub",
};
