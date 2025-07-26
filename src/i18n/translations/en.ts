import type {Translations} from "../index";

export const en: Translations = {
  // General
  isoCode: "en",
  languageName: "English",
  nativeName: "English",
  flag: "🇬🇧",

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

  // Toolbar tooltips
  addPersonTooltip: "Add a new person to current tree",
  clearAllTooltip: "Remove all persons from current tree",
  manageTreesTooltip: "Create, switch, delete or merge family trees",
  manageFilesTooltip: "Upload or download family tree data files",

  // Mode Toggle
  goToForestMode: "Go to Forest Mode",
  goToOneTreeMode: "Go to One Tree Mode",
  switchedToForestMode: "Switched to Forest Mode",
  switchedToOneTreeMode: "Switched to One Tree Mode",

  // Dialog
  editPerson: "Edit Person",
  addNewPerson: "Add New Person",
  name: "Name",
  mother: "Mother",
  father: "Father",
  info: "Info",
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
  resetFamilyExample: "Reset Family Example",
  failedToResetFamilyExample: "Failed to reset Family Example tree",
  errorResetFamilyExample: "Error resetting Family Example tree: {error}",
  actionCannotBeUndone: "This action cannot be undone.",

  // Placeholders and misc
  loadingGraph: "Loading genealogy graph...",
  reloadPage: "Reload Page",
  initializationError: "Initialization Error",
  failedToLoad: "Failed to load the genealogy graph application.",
  errorRenderingGraph: "Error Rendering Graph",
  person: "person",
  people: "people",

  // Language switcher
  language: "Language",
  selectLanguage: "Select Language",

  // Tree Management Dialog
  manageFamilyTrees: "Manage Family Trees",
  availableTrees: "Available Trees:",
  createNewTree: "Create New Tree:",
  createNewTreeMerging: "Create New Tree merging {treeA} and {treeB}",
  copyCurrentTreeData: "Copy current tree data",
  create: "Create",
  enterTreeName: "Enter tree name...",
  currentActiveTree: "Current active tree",
  currentTree: "Current Tree",
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

  // Tree validation errors
  treeNameEmpty: "Tree name cannot be empty",
  treeNameExists: "A tree with this name already exists",
  treeNotFound: "Tree not found",
  cannotDeleteFamilyExample: "Cannot delete the Family Example tree",
  cannotRenameFamilyExample: "Cannot rename the Family Example tree",

  // Tree merge and action tooltips
  selectedForMerge: "Selected for merge - click to deselect",
  selectForMerge: "Select for merge",
  clickToSwitchTo: "Click to switch to {treeName}",

  // Footer
  projectInfo: "Open Source Genealogy App",
  developedBy: "Developed by",
  sourceCode: "Source Code",
  viewOnGitHub: "View on GitHub",

  // Tree management notifications
  switchedToTree: "Switched to tree: {treeName}",
  errorUpdateAfterTreeChange: "Failed to update graph after tree change",
  errorLoadingFamilyExample: "Error loading family example",
  errorOpeningTreeManagement: "Error opening tree management",
  errorOpeningFileManager: "Error opening file management",

  // File Manager
  manageFiles: "Manage Files",
  downloadSection: "Download",
  uploadSection: "Upload",
  downloadCurrentTree: "Download Current Tree",
  downloadAllTrees: "Download All Trees",
  dragDropOrClick: "Drag & drop a JSON file here or click to select",
  selectFile: "Select File",
  uploadOptions: "Upload Options",
  mergeWithExisting: "Merge with existing data",
  replaceExisting: "Replace existing data",
  createNewTreeFile: "Create new tree",
  confirmUpload: "Upload",
  fileInformation: "File Information",
  fileName: "File Name",
  fileSize: "File Size",
  fileType: "Type",
  singleTree: "Single Tree",
  allTrees: "All Trees",
  treeCount: "Trees",
  totalPersons: "Total Persons",
  activeTree: "Active Tree",
  exportDate: "Export Date",
  personCount: "Persons",

  // File Manager notifications
  noTreeDataToDownload: "No tree data to download",
  treeDownloaded: 'Tree "{treeName}" downloaded successfully',
  noTreesToDownload: "No trees to download",
  allTreesDownloaded: "All {count} trees downloaded successfully",
  errorDownloadingTree: "Error downloading tree",
  errorDownloadingTrees: "Error downloading trees",
  invalidFileType: "Please select a JSON file",
  invalidJsonFile: "Invalid JSON file",
  noFileSelected: "No file selected",
  errorProcessingFile: "Error processing file",
  errorDuringUpload: "Error during upload",
  newTreeCreated: 'New tree "{treeName}" created successfully',
  treeReplaced: 'Tree "{treeName}" replaced successfully',
  treeMerged: 'Data merged into "{treeName}" successfully',
  allTreesImported: "{count} trees imported successfully",

  // Print
  printGraph: "Print Graph",
  printGraphTooltip: "Print the current genealogy graph",
};
