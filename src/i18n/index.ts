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
}

export const translations: Record<Language, Translations> = {
  en: {
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
  },

  fr: {
    // Page content
    pageTitle: "Explorateur d'Arbre Généalogique",
    pageDescription:
      "Application interactive de visualisation et de gestion d'arbre généalogique.",

    // Header
    appTitle: "Explorateur d'Arbre Généalogique",
    appSubtitle:
      "Visualisez et gérez votre généalogie familiale avec un graphique interactif. Cliquez sur une personne pour modifier ses détails ou ajouter de nouveaux membres de la famille.",

    // Toolbar
    addPerson: "Ajouter Personne",
    clearAll: "Tout Effacer",
    loading: "Chargement...",

    // Dialog
    editPerson: "Modifier Personne",
    addNewPerson: "Ajouter Nouvelle Personne",
    name: "Nom",
    mother: "Mère",
    father: "Père",
    required: "*",
    save: "Sauvegarder",
    remove: "Supprimer",
    cancel: "Annuler",

    // Validation messages
    nameRequired: "Le nom est requis",
    nameMaxLength: "Le nom doit faire 100 caractères ou moins",
    nameExists: "Une personne avec ce nom existe déjà",
    parentMaxLength: "doit faire 100 caractères ou moins",
    parentSameAsPerson: "ne peut pas être la même que la personne",
    fixErrors:
      "Veuillez corriger les erreurs de validation avant de sauvegarder",

    // Notifications
    graphUpdated: "Graphique mis à jour",
    graphCleared: "Graphique effacé",
    noDataToClear: "Aucune donnée à effacer",
    personNotFound: "non trouvé",
    errorRendering: "Échec du rendu du graphique",
    errorUpdating: "Échec de la mise à jour du graphique",
    errorSaving:
      "Une erreur s'est produite lors de la sauvegarde. Veuillez réessayer.",
    errorRemoving:
      "Une erreur s'est produite lors de la suppression de la personne. Veuillez réessayer.",
    errorOpening: "Erreur lors de l'ouverture des détails de la personne",
    errorClearing: "Erreur lors de l'effacement des données généalogiques",
    errorInitializing: "Échec de l'initialisation du graphique généalogique",

    // Confirmations
    confirmRemove: "Êtes-vous sûr de vouloir supprimer",
    confirmClear: "Êtes-vous sûr de vouloir supprimer tous les",
    actionCannotBeUndone: "Cette action ne peut pas être annulée.",

    // Placeholders and misc
    loadingGraph: "Chargement du graphique généalogique...",
    reloadPage: "Recharger la Page",
    initializationError: "Erreur d'Initialisation",
    failedToLoad: "Échec du chargement de l'application d'arbre généalogique.",
    errorRenderingGraph: "Erreur de Rendu du Graphique",

    // Language switcher
    language: "Langue",
    selectLanguage: "Sélectionner la Langue",
  },

  de: {
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
    confirmRemove: "Sind Sie sicher, dass Sie entfernen möchten",
    confirmClear: "Sind Sie sicher, dass Sie alle entfernen möchten",
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
  },
};

export function getTranslations(lang: Language): Translations {
  return translations[lang] || translations.en;
}

export const supportedLanguages: {
  code: Language;
  name: string;
  nativeName: string;
}[] = [
  {code: "en", name: "English", nativeName: "English"},
  {code: "fr", name: "French", nativeName: "Français"},
  {code: "de", name: "German", nativeName: "Deutsch"},
];
