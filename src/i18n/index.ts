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
  actionCannotBeUndone: string;

  // Placeholders and misc
  loadingGraph: string;
  reloadPage: string;
  initializationError: string;
  failedToLoad: string;
  errorRenderingGraph: string;

  // Language switcher
  language: string;
  selectLanguage: string;

  // Footer
  projectInfo: string;
  developedBy: string;
  sourceCode: string;
  viewOnGitHub: string;
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
  {code: "en", name: "English", nativeName: "English", flag: "🇺🇸"},
  {code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷"},
  {code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪"},
];
