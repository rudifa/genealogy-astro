import {en, fr, de} from "./translations";

export type Language = "en" | "fr" | "de";

export interface Translations {
  // Page content
  pageTitle: string;
  pageDescription: string;

  // Header
  appTitle: string;
  appSubtitle: string;

  // Toolbar
  addPerson: string;
  clearAll: string;
  familyExample: string;
  manageTrees: string;
  loading: string;

  // Dialog
  editPerson: string;
  addNewPerson: string;
  name: string;
  mother: string;
  father: string;
  required: string;
  save: string;
  remove: string;
  cancel: string;

  // Validation messages
  nameRequired: string;
  nameMaxLength: string;
  nameExists: string;
  parentMaxLength: string;
  parentSameAsPerson: string;
  fixErrors: string;

  // Notifications
  graphUpdated: string;
  graphCleared: string;
  noDataToClear: string;
  familyExampleLoaded: string;
  personNotFound: string;
  errorRendering: string;
  errorUpdating: string;
  errorSaving: string;
  errorRemoving: string;
  errorOpening: string;
  errorClearing: string;
  errorInitializing: string;

  // Confirmations
  confirmRemove: string;
  confirmClear: string;
  confirmFamilyExample: string;
  confirmResetFamilyExample: string;
  confirmLoadFamilyExample: string;
  resetFamilyExample: string;
  failedToResetFamilyExample: string;
  errorResetFamilyExample: string;
  actionCannotBeUndone: string;

  // Placeholders and misc
  loadingGraph: string;
  reloadPage: string;
  initializationError: string;
  failedToLoad: string;
  errorRenderingGraph: string;
  person: string;
  people: string;

  // Language switcher
  language: string;
  selectLanguage: string;

  // Tree Management Dialog
  manageFamilyTrees: string;
  availableTrees: string;
  createNewTree: string;
  createNewTreeMerging: string;
  copyCurrentTreeData: string;
  create: string;
  enterTreeName: string;
  currentActiveTree: string;
  currentTree: string;
  switchToTree: string;
  deleteTree: string;
  confirmDeleteTree: string;
  enterTreeNamePrompt: string;
  failedToSwitchTree: string;
  failedToDeleteTree: string;
  failedToCreateTree: string;
  errorSwitchingTree: string;
  errorDeletingTree: string;
  errorCreatingTree: string;

  // Tree validation errors
  treeNameEmpty: string;
  treeNameExists: string;
  treeNotFound: string;
  cannotDeleteFamilyExample: string;
  cannotRenameFamilyExample: string;

  // Tree merge and action tooltips
  selectedForMerge: string;
  selectForMerge: string;
  clickToSwitchTo: string;

  // Footer
  projectInfo: string;
  developedBy: string;
  sourceCode: string;
  viewOnGitHub: string;

  // Tree management notifications
  switchedToTree: string;
  errorUpdateAfterTreeChange: string;
  errorLoadingFamilyExample: string;
  errorOpeningTreeManagement: string;
}

export const translations: Record<Language, Translations> = {
  en,
  fr,
  de,
};

export function getTranslations(lang: Language): Translations {
  return translations[lang] || translations.en;
}

export const supportedLanguages: {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}[] = [
  {code: "en", name: "English", nativeName: "English", flag: "🇬🇧"},
  {code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷"},
  {code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪"},
];
