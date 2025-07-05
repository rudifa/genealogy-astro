import type {Translations} from "../index";

export const fr: Translations = {
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
  familyExample: "Exemple Familial",
  manageTrees: "Gérer les Arbres",
  loading: "Chargement...",

  // Mode Toggle
  goToForestMode: "Aller au Mode Forêt",
  goToOneTreeMode: "Aller au Mode Arbre Solitaire",

  // Dialog
  editPerson: "Modifier Personne",
  addNewPerson: "Ajouter Nouvelle Personne",
  name: "Nom",
  mother: "Mère",
  father: "Père",
  info: "Info",
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
  fixErrors: "Veuillez corriger les erreurs de validation avant de sauvegarder",

  // Notifications
  graphUpdated: "Graphique mis à jour",
  graphCleared: "Graphique effacé",
  noDataToClear: "Aucune donnée à effacer",
  familyExampleLoaded: "Exemple familial chargé",
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
  confirmRemove:
    "Êtes-vous sûr de vouloir supprimer {name}? Cette action ne peut pas être annulée.",
  confirmClear:
    "Êtes-vous sûr de vouloir supprimer toutes les {count} {people} de la généalogie? Cette action ne peut pas être annulée.",
  confirmFamilyExample:
    "Êtes-vous sûr de vouloir charger l'exemple familial? Cela remplacera vos données actuelles et ne peut pas être annulé.",
  confirmResetFamilyExample:
    "Êtes-vous sûr de vouloir réinitialiser l'arbre Exemple Familial à son état d'origine? Cela remplacera toutes les données actuelles.",
  confirmLoadFamilyExample:
    "Êtes-vous sûr de vouloir charger les données de l'exemple familial dans l'arbre \"{treeName}\"? Cela remplacera toutes les données actuelles.",
  resetFamilyExample: "Réinitialiser l'Exemple Familial",
  failedToResetFamilyExample:
    "Échec de la réinitialisation de l'arbre Exemple Familial",
  errorResetFamilyExample:
    "Erreur lors de la réinitialisation de l'arbre Exemple Familial : {error}",
  actionCannotBeUndone: "Cette action ne peut pas être annulée.",

  // Placeholders and misc
  loadingGraph: "Chargement du graphique généalogique...",
  reloadPage: "Recharger la Page",
  initializationError: "Erreur d'Initialisation",
  failedToLoad: "Échec du chargement de l'application d'arbre généalogique.",
  errorRenderingGraph: "Erreur de Rendu du Graphique",
  person: "personne",
  people: "personnes",

  // Language switcher
  language: "Langue",
  selectLanguage: "Sélectionner la Langue",

  // Tree Management Dialog
  manageFamilyTrees: "Gérer les Arbres Généalogiques",
  availableTrees: "Arbres Disponibles:",
  createNewTree: "Créer un Nouvel Arbre:",
  createNewTreeMerging: "Créer un Nouvel Arbre fusionnant {treeA} et {treeB}",
  copyCurrentTreeData: "Copier les données de l'arbre actuel",
  create: "Créer",
  enterTreeName: "Entrez le nom de l'arbre...",
  currentActiveTree: "Arbre actuel actif",
  currentTree: "Arbre Actuel",
  switchToTree: "Basculer vers cet arbre",
  deleteTree: "Supprimer cet arbre",
  confirmDeleteTree:
    'Êtes-vous sûr de vouloir supprimer l\'arbre "{name}"? Cette action ne peut pas être annulée.',
  enterTreeNamePrompt: "Veuillez entrer un nom d'arbre",
  failedToSwitchTree: "Échec du basculement vers l'arbre",
  failedToDeleteTree: "Échec de la suppression de l'arbre",
  failedToCreateTree: "Échec de la création de l'arbre",
  errorSwitchingTree: "Erreur lors du basculement vers l'arbre: {error}",
  errorDeletingTree: "Erreur lors de la suppression de l'arbre: {error}",
  errorCreatingTree: "Erreur lors de la création de l'arbre: {error}",

  // Tree validation errors
  treeNameEmpty: "Le nom de l'arbre ne peut pas être vide",
  treeNameExists: "Un arbre avec ce nom existe déjà",
  treeNotFound: "Arbre non trouvé",
  cannotDeleteFamilyExample: "Impossible de supprimer l'arbre Exemple Familial",
  cannotRenameFamilyExample: "Impossible de renommer l'arbre Exemple Familial",

  // Tree merge and action tooltips
  selectedForMerge: "Sélectionné pour fusion - cliquer pour désélectionner",
  selectForMerge: "Sélectionner pour fusion",
  clickToSwitchTo: "Cliquer pour basculer vers {treeName}",

  // Footer
  projectInfo: "Application Généalogique Open Source",
  developedBy: "Développé par",
  sourceCode: "Code Source",
  viewOnGitHub: "Voir sur GitHub",

  // Tree management notifications
  switchedToTree: "Basculé vers l'arbre : {treeName}",
  errorUpdateAfterTreeChange:
    "Échec de mise à jour du graphique après changement d'arbre",
  errorLoadingFamilyExample: "Erreur lors du chargement de l'exemple familial",
  errorOpeningTreeManagement:
    "Erreur lors de l'ouverture de la gestion des arbres",
  errorOpeningFileManager:
    "Erreur lors de l'ouverture de la gestion des fichiers",

  // File Manager
  manageFiles: "Gérer les Fichiers",
  downloadSection: "Télécharger",
  uploadSection: "Téléverser",
  downloadCurrentTree: "Télécharger l'Arbre Actuel",
  downloadAllTrees: "Télécharger Tous les Arbres",
  dragDropOrClick:
    "Glissez-déposez un fichier JSON ici ou cliquez pour sélectionner",
  selectFile: "Sélectionner un Fichier",
  uploadOptions: "Options de Téléversement",
  mergeWithExisting: "Fusionner avec les données existantes",
  replaceExisting: "Remplacer les données existantes",
  createNewTreeFile: "Créer un nouvel arbre",
  confirmUpload: "Téléverser",
  fileInformation: "Informations du Fichier",
  fileName: "Nom du Fichier",
  fileSize: "Taille du Fichier",
  fileType: "Type",
  singleTree: "Arbre Unique",
  allTrees: "Tous les Arbres",
  treeCount: "Arbres",
  totalPersons: "Total des Personnes",
  activeTree: "Arbre Actif",
  exportDate: "Date d'Export",
  personCount: "Personnes",

  // File Manager notifications
  noTreeDataToDownload: "Aucune donnée d'arbre à télécharger",
  treeDownloaded: 'Arbre "{treeName}" téléchargé avec succès',
  noTreesToDownload: "Aucun arbre à télécharger",
  allTreesDownloaded: "Tous les {count} arbres téléchargés avec succès",
  errorDownloadingTree: "Erreur lors du téléchargement de l'arbre",
  errorDownloadingTrees: "Erreur lors du téléchargement des arbres",
  invalidFileType: "Veuillez sélectionner un fichier JSON",
  invalidJsonFile: "Fichier JSON invalide",
  noFileSelected: "Aucun fichier sélectionné",
  errorProcessingFile: "Erreur lors du traitement du fichier",
  errorDuringUpload: "Erreur lors du téléversement",
  newTreeCreated: 'Nouvel arbre "{treeName}" créé avec succès',
  treeReplaced: 'Arbre "{treeName}" remplacé avec succès',
  treeMerged: 'Données fusionnées dans "{treeName}" avec succès',
  allTreesImported: "{count} arbres importés avec succès",
};
