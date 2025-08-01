import type {Translations} from "../index";

export const it: Translations = {
  // General
  isoCode: "it",
  languageName: "Italian",
  nativeName: "Italiano",
  flag: "🇮🇹",

  // Page content
  pageTitle: "Esploratore dell'Albero Genealogico",
  pageDescription:
    "Applicazione interattiva per la visualizzazione e gestione dell'albero genealogico.",

  // Header
  appTitle: "Esploratore dell'Albero Genealogico",
  appSubtitle:
    "Visualizza e gestisci la genealogia della tua famiglia con un grafico interattivo. Clicca su una persona per modificarne i dettagli o aggiungere nuovi membri.",

  // Toolbar
  addPerson: "Aggiungi persona",
  clearAll: "Cancella tutto",
  familyExample: "Esempio di famiglia",
  manageTrees: "Gestisci alberi",
  loading: "Caricamento...",

  // Toolbar tooltips
  addPersonTooltip: "Aggiungi una nuova persona all'albero corrente",
  clearAllTooltip: "Rimuovi tutte le persone dall'albero corrente",
  manageTreesTooltip: "Crea, cambia, elimina o unisci alberi genealogici",
  manageFilesTooltip: "Carica o scarica file di dati dell'albero genealogico",

  // Mode Toggle
  goToForestMode: "Vai alla modalità foresta",
  goToOneTreeMode: "Vai alla modalità singolo albero",
  switchedToForestMode: "Passato alla modalità foresta",
  switchedToOneTreeMode: "Passato alla modalità singolo albero",

  // Dialog
  editPerson: "Modifica persona",
  addNewPerson: "Aggiungi nuova persona",
  name: "Nome",
  mother: "Madre",
  father: "Padre",
  info: "Info",
  required: "*",
  save: "Salva",
  remove: "Rimuovi",
  cancel: "Annulla",

  // Sibling (Add Sibling mode)
  addSibling: "Aggiungi sorella / fratello",
  addSiblingTo: "Aggiungi una sorella / un fratello a {name}",
  siblingAdded: "Sorella / fratello aggiunto con successo.",
  siblingAdvice:
    "Inserisci il nome e le informazioni della sorella / del fratello.",
  siblingExists: "Esiste già una sorella / un fratello con questo nome.",

  // Validation messages
  pleaseFillField: "Per favore compila questo campo",
  nameRequired: "Il nome è obbligatorio",
  nameMaxLength: "Il nome deve essere di 100 caratteri o meno",
  nameExists: "Esiste già una persona con questo nome",
  parentMaxLength: "Il nome deve essere di 100 caratteri o meno",
  parentSameAsPerson: "non può essere la stessa persona",
  fixErrors: "Correggi gli errori di validazione prima di salvare",

  // Notifications
  graphUpdated: "Grafico aggiornato",
  graphCleared: "Grafico cancellato",
  noDataToClear: "Nessun dato da cancellare",
  familyExampleLoaded: "Esempio di famiglia caricato",
  personNotFound: "non trovato",
  errorRendering: "Impossibile visualizzare il grafico",
  errorUpdating: "Impossibile aggiornare il grafico",
  errorSaving: "Si è verificato un errore durante il salvataggio. Riprova.",
  errorRemoving:
    "Si è verificato un errore durante la rimozione della persona. Riprova.",
  errorOpening: "Errore nell'apertura dei dettagli della persona",
  errorClearing: "Errore nella cancellazione dei dati genealogici",
  errorInitializing: "Impossibile inizializzare il grafico genealogico",

  // Confirmations
  confirmRemove:
    "Sei sicuro di voler rimuovere {name}? Questa azione non può essere annullata.",
  confirmClear:
    "Sei sicuro di voler rimuovere tutte le {count} {people} dalla genealogia? Questa azione non può essere annullata.",
  confirmFamilyExample:
    "Sei sicuro di voler caricare l'esempio di famiglia? Questo sostituirà i tuoi dati attuali e non può essere annullato.",
  confirmResetFamilyExample:
    "Sei sicuro di voler ripristinare l'albero Esempio di Famiglia allo stato originale? Questo sostituirà tutti i dati attuali.",
  confirmLoadFamilyExample:
    'Sei sicuro di voler caricare i dati di esempio della famiglia nell\'albero "{treeName}"? Questo sostituirà tutti i dati attuali.',
  resetFamilyExample: "Ripristina esempio di famiglia",
  failedToResetFamilyExample:
    "Impossibile ripristinare l'albero Esempio di Famiglia",
  errorResetFamilyExample:
    "Errore nel ripristino dell'albero Esempio di Famiglia: {error}",
  actionCannotBeUndone: "Questa azione non può essere annullata.",

  // Placeholders and misc
  loadingGraph: "Caricamento del grafico genealogico...",
  reloadPage: "Ricarica pagina",
  initializationError: "Errore di inizializzazione",
  failedToLoad: "Impossibile caricare l'applicazione del grafico genealogico.",
  errorRenderingGraph: "Errore nella visualizzazione del grafico",
  person: "persona",
  people: "persone",

  // Language switcher
  language: "Lingua",
  selectLanguage: "Seleziona lingua",

  // Tree Management Dialog
  manageFamilyTrees: "Gestisci alberi genealogici",
  availableTrees: "Alberi disponibili:",
  createNewTree: "Crea nuovo albero:",
  createNewTreeMerging: "Crea nuovo albero unendo {treeA} e {treeB}",
  copyCurrentTreeData: "Copia i dati dell'albero corrente",
  create: "Crea",
  enterTreeName: "Inserisci il nome dell'albero...",
  currentActiveTree: "Albero attivo corrente",
  currentTree: "Albero corrente",
  switchToTree: "Passa a questo albero",
  deleteTree: "Elimina questo albero",
  confirmDeleteTree:
    'Sei sicuro di voler eliminare l\'albero "{name}"? Questa azione non può essere annullata.',
  enterTreeNamePrompt: "Inserisci un nome per l'albero",
  failedToSwitchTree: "Impossibile passare all'albero",
  failedToDeleteTree: "Impossibile eliminare l'albero",
  failedToCreateTree: "Impossibile creare l'albero",
  errorSwitchingTree: "Errore nel passaggio all'albero: {error}",
  errorDeletingTree: "Errore nell'eliminazione dell'albero: {error}",
  errorCreatingTree: "Errore nella creazione dell'albero: {error}",

  // Tree validation errors
  treeNameEmpty: "Il nome dell'albero non può essere vuoto",
  treeNameExists: "Esiste già un albero con questo nome",
  treeNotFound: "Albero non trovato",
  cannotDeleteFamilyExample:
    "Impossibile eliminare l'albero Esempio di Famiglia",
  cannotRenameFamilyExample:
    "Impossibile rinominare l'albero Esempio di Famiglia",

  // Tree merge and action tooltips
  selectedForMerge: "Selezionato per unione - clicca per deselezionare",
  selectForMerge: "Seleziona per unione",
  clickToSwitchTo: "Clicca per passare a {treeName}",

  // Footer
  projectInfo: "App genealogica open source",
  developedBy: "Sviluppato da",
  sourceCode: "Codice sorgente",
  viewOnGitHub: "Vedi su GitHub",

  // Tree management notifications
  switchedToTree: "Passato all'albero: {treeName}",
  errorUpdateAfterTreeChange:
    "Impossibile aggiornare il grafico dopo il cambio di albero",
  errorLoadingFamilyExample: "Errore nel caricamento dell'esempio di famiglia",
  errorOpeningTreeManagement:
    "Errore nell'apertura della gestione degli alberi",
  errorOpeningFileManager: "Errore nell'apertura della gestione dei file",

  // File Manager
  manageFiles: "Gestisci file",
  downloadSection: "Scarica",
  uploadSection: "Carica",
  downloadCurrentTree: "Scarica albero corrente",
  downloadAllTrees: "Scarica tutti gli alberi",
  dragDropOrClick:
    "Trascina e rilascia un file JSON qui o clicca per selezionare",
  selectFile: "Seleziona file",
  uploadOptions: "Opzioni di caricamento",
  mergeWithExisting: "Unisci con i dati esistenti",
  replaceExisting: "Sostituisci i dati esistenti",
  createNewTreeFile: "Crea nuovo albero",
  confirmUpload: "Carica",
  fileInformation: "Informazioni sul file",
  fileName: "Nome file",
  fileSize: "Dimensione file",
  fileType: "Tipo",
  singleTree: "Albero singolo",
  allTrees: "Tutti gli alberi",
  treeCount: "Alberi",
  totalPersons: "Totale persone",
  activeTree: "Albero attivo",
  exportDate: "Data di esportazione",
  personCount: "Persone",

  // File Manager notifications
  noTreeDataToDownload: "Nessun dato dell'albero da scaricare",
  treeDownloaded: 'Albero "{treeName}" scaricato con successo',
  noTreesToDownload: "Nessun albero da scaricare",
  allTreesDownloaded: "Tutti i {count} alberi scaricati con successo",
  errorDownloadingTree: "Errore nello scaricamento dell'albero",
  errorDownloadingTrees: "Errore nello scaricamento degli alberi",
  invalidFileType: "Seleziona un file JSON",
  invalidJsonFile: "File JSON non valido",
  noFileSelected: "Nessun file selezionato",
  errorProcessingFile: "Errore nell'elaborazione del file",
  errorDuringUpload: "Errore durante il caricamento",
  newTreeCreated: 'Nuovo albero "{treeName}" creato con successo',
  treeReplaced: 'Albero "{treeName}" sostituito con successo',
  treeMerged: 'Dati uniti in "{treeName}" con successo',
  allTreesImported: "{count} alberi importati con successo",

  // Print
  printGraph: "Stampa grafico",
  printGraphTooltip: "Stampa il grafico genealogico corrente",
};
