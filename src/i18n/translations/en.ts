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
  confirmRemove: "Are you sure you want to remove",
  confirmClear: "Are you sure you want to remove all",
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

  // Footer
  projectInfo: "Open Source Genealogy App",
  developedBy: "Developed by",
  sourceCode: "Source Code",
  viewOnGitHub: "View on GitHub",
};
