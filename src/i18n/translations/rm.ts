import type {Translations} from "../index";

export const rm: Translations = {
  // General
  isoCode: "rm",
  languageName: "Romansh",
  nativeName: "Rumantsch",
  flag: "🇨🇭",

  // Page content
  pageTitle: "Exploratour da l'arver genealogic",
  pageDescription:
    "Applitg interactiv per visualisar e gestir l'arver genealogic.",

  // Header
  appTitle: "Exploratour da l'arver genealogic",
  appSubtitle:
    "Visualisescha e gestescha tia genealogia cun in graf interactiv. Clicca sin ina persuna per modifitgar detagls u agiuntar commembers.",

  // Toolbar
  addPerson: "Agiuntar persuna",
  clearAll: "Stizzar tut",
  familyExample: "Exempel da famiglia",
  manageTrees: "Administrar arvers",
  loading: "Chargiar...",

  // Toolbar tooltips
  addPersonTooltip: "Agiuntar ina nova persuna a l'arver actual",
  clearAllTooltip: "Stizzar tut las persunas da l'arver actual",
  manageTreesTooltip: "Crear, midar, stizzar u unir arvers genealogics",
  manageFilesTooltip: "Chargiar u telechargiar datotecas da l'arver genealogic",

  // Mode Toggle
  goToForestMode: "Ir a moda guaud",
  goToOneTreeMode: "Ir a moda singul arver",
  switchedToForestMode: "Midà a moda guaud",
  switchedToOneTreeMode: "Midà a moda singul arver",

  // Dialog
  editPerson: "Modifitgar persuna",
  addNewPerson: "Agiuntar nova persuna",
  name: "Num",
  mother: "Mamma",
  father: "Bab",
  info: "Infurmaziuns",
  required: "*",
  save: "Memorisar",
  remove: "Stizzar",
  cancel: "Interrumper",

  // Sibling (Add Sibling mode)
  addSibling: "Agiuntar sora / frar",
  addSiblingTo: "Agiuntar ina sora / in frar a {name}",
  siblingAdded: "Sora / frar agiuntà cun success.",
  siblingAdvice: "Endatescha il num e las infurmaziuns da la sora / dal frar.",
  siblingExists: "Ina sora / in frar cun quest num exista gia.",

  // Validation messagespleaseFillField: "Per plaschair endatescha quest champ",
  pleaseFillField: "Per plaschair endatescha quest champ",
  nameRequired: "Il num è obligatoric",
  nameMaxLength: "Il num sto avair maximalmain 100 caracters",
  nameExists: "Ina persuna cun quest num exista gia",
  parentMaxLength: "Il num sto avair maximalmain 100 caracters",
  parentSameAsPerson: "na po betg esser la medema persuna",
  fixErrors: "Per plaschair corriger ils sbagls avant memorisar",

  // Notifications
  graphUpdated: "Graf actualisà",
  graphCleared: "Graf stizzà",
  noDataToClear: "Nagina datoteca da stizzar",
  familyExampleLoaded: "Exempel da famiglia chargià",
  personNotFound: "betg chattà",
  errorRendering: "Betg reussì da visualisar il graf",
  errorUpdating: "Betg reussì d'actualisar il graf",
  errorSaving:
    "Ina errur è succedida durant il memorisar. Emprova anc ina giada.",
  errorRemoving:
    "Ina errur è succedida durant il stizzar la persuna. Emprova anc ina giada.",
  errorOpening: "Errur durant l'avertura dals detagls da la persuna",
  errorClearing: "Errur durant il stizzar da datas genealogicas",
  errorInitializing: "Betg reussì d'inizialisar il graf genealogic",

  // Confirmations
  confirmRemove:
    "Vuls ti propi stizzar {name}? Questa acziun na po betg vegnir revocada.",
  confirmClear:
    "Vuls ti propi stizzar tut las {count} {people} da la genealogia? Questa acziun na po betg vegnir revocada.",
  confirmFamilyExample:
    "Vuls ti propi chargiar l'exempel da famiglia? Quai remplazza tias datas actualas e na po betg vegnir revocà.",
  confirmResetFamilyExample:
    "Vuls ti propi reinitialisar l'arver Exempel da famiglia? Quai remplazza tut las datas actualas.",
  confirmLoadFamilyExample:
    "Vuls ti propi chargiar las datas d'exempel da famiglia en l'arver \"{treeName}\"? Quai remplazza tut las datas actualas.",
  resetFamilyExample: "Reinitialisar exempel da famiglia",
  failedToResetFamilyExample:
    "Betg reussì da reinitialisar l'arver Exempel da famiglia",
  errorResetFamilyExample:
    "Errur durant la reinitialisaziun da l'arver Exempel da famiglia: {error}",
  actionCannotBeUndone: "Questa acziun na po betg vegnir revocada.",

  // Placeholders and misc
  loadingGraph: "Chargiar il graf genealogic...",
  reloadPage: "Rechargiar la pagina",
  initializationError: "Errur d'inizialisaziun",
  failedToLoad: "Betg reussì da chargiar l'applitg dal graf genealogic.",
  errorRenderingGraph: "Errur durant la visualisaziun dal graf",
  person: "persuna",
  people: "persunas",

  // Language switcher
  language: "Lingua",
  selectLanguage: "Tscherner lingua",

  // Tree Management Dialog
  manageFamilyTrees: "Administrar arvers genealogics",
  availableTrees: "Arvers disponibels:",
  createNewTree: "Crear nov arver:",
  createNewTreeMerging: "Crear nov arver cun unir {treeA} e {treeB}",
  copyCurrentTreeData: "Copiar datas da l'arver actual",
  create: "Crear",
  enterTreeName: "Endatar num da l'arver...",
  currentActiveTree: "Arver activ actual",
  currentTree: "Arver actual",
  switchToTree: "Midar sin quest arver",
  deleteTree: "Stizzar quest arver",
  confirmDeleteTree:
    'Vuls ti propi stizzar l\'arver "{name}"? Questa acziun na po betg vegnir revocada.',
  enterTreeNamePrompt: "Per plaschair endatar in num d'arver",
  failedToSwitchTree: "Betg reussì da midar arver",
  failedToDeleteTree: "Betg reussì da stizzar arver",
  failedToCreateTree: "Betg reussì da crear arver",
  errorSwitchingTree: "Errur durant il midar arver: {error}",
  errorDeletingTree: "Errur durant il stizzar arver: {error}",
  errorCreatingTree: "Errur durant il crear arver: {error}",

  // Tree validation errors
  treeNameEmpty: "Il num d'arver na po betg esser vid",
  treeNameExists: "In arver cun quest num exista gia",
  treeNotFound: "Arver betg chattà",
  cannotDeleteFamilyExample:
    "Betg pussaivel da stizzar l'arver Exempel da famiglia",
  cannotRenameFamilyExample:
    "Betg pussaivel da renumnar l'arver Exempel da famiglia",

  // Tree merge and action tooltips
  selectedForMerge: "Tscherì per unir - cliccar per de-tscherner",
  selectForMerge: "Tscherner per unir",
  clickToSwitchTo: "Cliccar per midar sin {treeName}",

  // Footer
  projectInfo: "App genealogica open source",
  developedBy: "Elavurà da",
  sourceCode: "Cudesch da funtauna",
  viewOnGitHub: "Vesair sin GitHub",

  // Tree management notifications
  switchedToTree: "Midà sin arver: {treeName}",
  errorUpdateAfterTreeChange:
    "Betg reussì d'actualisar il graf suenter midada d'arver",
  errorLoadingFamilyExample:
    "Errur durant il chargiar da l'exempel da famiglia",
  errorOpeningTreeManagement: "Errur durant l'avertura da la gestiun d'arvers",
  errorOpeningFileManager: "Errur durant l'avertura da la gestiun da datotecas",

  // File Manager
  manageFiles: "Administrar datotecas",
  downloadSection: "Telechargiar",
  uploadSection: "Chargiar",
  downloadCurrentTree: "Telechargiar arver actual",
  downloadAllTrees: "Telechargiar tut ils arvers",
  dragDropOrClick: "Trar & laschar in file JSON qua u cliccar per tscherner",
  selectFile: "Tscherner file",
  uploadOptions: "Opziuns da chargiar",
  mergeWithExisting: "Unir cun datas existentas",
  replaceExisting: "Sustituir datas existentas",
  createNewTreeFile: "Crear nov arver",
  confirmUpload: "Chargiar",
  fileInformation: "Infurmaziuns dal file",
  fileName: "Num dal file",
  fileSize: "Grondezza dal file",
  fileType: "Tip",
  singleTree: "Singul arver",
  allTrees: "Tuts arvers",
  treeCount: "Arvers",
  totalPersons: "Total persunas",
  activeTree: "Arver activ",
  exportDate: "Data d'export",
  personCount: "Persunas",

  // File Manager notifications
  noTreeDataToDownload: "Nagina datoteca d'arver da telechargiar",
  treeDownloaded: 'Arver "{treeName}" telechargià cun success',
  noTreesToDownload: "Nagin arver da telechargiar",
  allTreesDownloaded: "Tuts ils {count} arvers telechargiads cun success",
  errorDownloadingTree: "Errur durant il telechargiar arver",
  errorDownloadingTrees: "Errur durant il telechargiar arvers",
  invalidFileType: "Per plaschair tscherner in file JSON",
  invalidJsonFile: "File JSON nunvalid",
  noFileSelected: "Nagin file tschernì",
  errorProcessingFile: "Errur durant l'elavuraziun dal file",
  errorDuringUpload: "Errur durant il chargiar",
  newTreeCreated: 'Nov arver "{treeName}" creà cun success',
  treeReplaced: 'Arver "{treeName}" remplazzà cun success',
  treeMerged: 'Datas unidas en "{treeName}" cun success',
  allTreesImported: "{count} arvers importads cun success",

  // Print
  printGraph: "Stampar graf",
  printGraphTooltip: "Stampar il graf genealogic actual",
};
