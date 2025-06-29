import type {Translations} from "../index";

export const de: Translations = {
  // Page content
  pageTitle: "Familienstamm-Explorer",
  pageDescription:
    "Interaktive Familienstamm-Visualisierung und Genealogie-Verwaltungsanwendung.",

  // Header
  appTitle: "Familienstamm-Explorer",
  appSubtitle:
    "Visualisieren und verwalten Sie Ihre Familiengenealgie mit einem interaktiven Graphen. Klicken Sie auf eine Person, um ihre Details zu bearbeiten oder neue Familienmitglieder hinzuzufügen.",

  // Toolbar
  addPerson: "Person Hinzufügen",
  clearAll: "Alles Löschen",
  familyExample: "Familienbeispiel",
  manageTrees: "Bäume Verwalten",
  loading: "Laden...",

  // Dialog
  editPerson: "Person Bearbeiten",
  addNewPerson: "Neue Person Hinzufügen",
  name: "Name",
  mother: "Mutter",
  father: "Vater",
  required: "*",
  save: "Speichern",
  remove: "Entfernen",
  cancel: "Abbrechen",

  // Validation messages
  nameRequired: "Name ist erforderlich",
  nameMaxLength: "Name muss 100 Zeichen oder weniger haben",
  nameExists: "Eine Person mit diesem Namen existiert bereits",
  parentMaxLength: "muss 100 Zeichen oder weniger haben",
  parentSameAsPerson: "kann nicht dieselbe wie die Person sein",
  fixErrors: "Bitte beheben Sie die Validierungsfehler vor dem Speichern",

  // Notifications
  graphUpdated: "Graph aktualisiert",
  graphCleared: "Graph geleert",
  noDataToClear: "Keine Daten zum Löschen",
  familyExampleLoaded: "Familienbeispiel geladen",
  personNotFound: "nicht gefunden",
  errorRendering: "Graph-Rendering fehlgeschlagen",
  errorUpdating: "Graph-Aktualisierung fehlgeschlagen",
  errorSaving:
    "Ein Fehler beim Speichern ist aufgetreten. Bitte versuchen Sie es erneut.",
  errorRemoving:
    "Ein Fehler beim Entfernen der Person ist aufgetreten. Bitte versuchen Sie es erneut.",
  errorOpening: "Fehler beim Öffnen der Personendetails",
  errorClearing: "Fehler beim Löschen der Genealogie-Daten",
  errorInitializing: "Genealogie-Graph-Initialisierung fehlgeschlagen",

  // Confirmations
  confirmRemove:
    "Sind Sie sicher, dass Sie {name} entfernen möchten? Diese Aktion kann nicht rückgängig gemacht werden.",
  confirmClear:
    "Sind Sie sicher, dass Sie alle {count} {people} aus der Genealogie entfernen möchten? Diese Aktion kann nicht rückgängig gemacht werden.",
  confirmFamilyExample:
    "Sind Sie sicher, dass Sie das Familienbeispiel laden möchten? Dies ersetzt Ihre aktuellen Daten und kann nicht rückgängig gemacht werden.",
  confirmResetFamilyExample:
    "Sind Sie sicher, dass Sie den Familienbeispiel-Baum auf seinen ursprünglichen Zustand zurücksetzen möchten? Dies ersetzt alle aktuellen Daten.",
  confirmLoadFamilyExample:
    'Sind Sie sicher, dass Sie die Familienbeispiel-Daten in den "{treeName}"-Baum laden möchten? Dies ersetzt alle aktuellen Daten.',
  actionCannotBeUndone: "Diese Aktion kann nicht rückgängig gemacht werden.",

  // Placeholders and misc
  loadingGraph: "Genealogie-Graph wird geladen...",
  reloadPage: "Seite Neu Laden",
  initializationError: "Initialisierungsfehler",
  failedToLoad: "Fehler beim Laden der Genealogie-Graph-Anwendung.",
  errorRenderingGraph: "Fehler beim Graph-Rendering",

  // Language switcher
  language: "Sprache",
  selectLanguage: "Sprache Auswählen",

  // Tree Management Dialog
  manageFamilyTrees: "Familienstammbäume Verwalten",
  availableTrees: "Verfügbare Bäume:",
  createNewTree: "Neuen Baum Erstellen:",
  copyCurrentTreeData: "Aktuelle Baumdaten kopieren",
  create: "Erstellen",
  enterTreeName: "Baumname eingeben...",
  currentActiveTree: "Aktueller aktiver Baum",
  switchToTree: "Zu diesem Baum wechseln",
  deleteTree: "Diesen Baum löschen",
  confirmDeleteTree:
    'Sind Sie sicher, dass Sie den Baum "{name}" löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.',
  enterTreeNamePrompt: "Bitte geben Sie einen Baumname ein",
  failedToSwitchTree: "Wechsel zum Baum fehlgeschlagen",
  failedToDeleteTree: "Löschen des Baums fehlgeschlagen",
  failedToCreateTree: "Erstellen des Baums fehlgeschlagen",
  errorSwitchingTree: "Fehler beim Wechseln zum Baum: {error}",
  errorDeletingTree: "Fehler beim Löschen des Baums: {error}",
  errorCreatingTree: "Fehler beim Erstellen des Baums: {error}",

  // Footer
  projectInfo: "Open Source Genealogie-App",
  developedBy: "Entwickelt von",
  sourceCode: "Quellcode",
  viewOnGitHub: "Auf GitHub ansehen",
};
