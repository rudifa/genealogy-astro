// Japanese translations for the genealogy app
import type {Translations} from "../index";

export const ja: Translations = {
  // General
  isoCode: "ja",
  languageName: "Japanese",
  nativeName: "日本語",
  flag: "🇯🇵",

  // Footer
  pageTitle: "家系図アプリ",
  pageDescription: "家族のつながりを視覚化し、管理するための家系図アプリです。",

  // Header
  appTitle: "家系図",
  appSubtitle: "家族の歴史を記録しましょう",

  // Toolbar
  addPerson: "人物を追加",
  clearAll: "全てクリア",
  familyExample: "家族の例",
  manageTrees: "家系管理",
  loading: "読み込み中...",

  // Toolbar tooltips
  addPersonTooltip: "新しい人物を追加",
  clearAllTooltip: "全ての人物を削除",
  manageTreesTooltip: "家系を管理",
  manageFilesTooltip: "ファイルを管理",

  // Mode Toggle
  goToForestMode: "フォレストモードへ",
  goToOneTreeMode: "ワンツリーモードへ",
  switchedToForestMode: "フォレストモードに切り替えました",
  switchedToOneTreeMode: "ワンツリーモードに切り替えました",

  // Dialog
  editPerson: "人物を編集",
  addNewPerson: "新しい人物を追加",
  name: "名前",
  mother: "母",
  father: "父",
  info: "情報",
  required: "必須",
  save: "保存",
  remove: "削除",
  cancel: "キャンセル",

  // Sibling (Add Sibling mode)
  addSibling: "兄弟姉妹を追加",
  addSiblingTo: "{name} に兄弟姉妹を追加",
  siblingAdded: "兄弟姉妹が正常に追加されました。",
  siblingAdvice: "兄弟姉妹の名前と情報を入力してください。",
  siblingExists: "この名前の兄弟姉妹はすでに存在します。",

  // Validation messages
  pleaseFillField: "このフィールドを入力してください",
  nameRequired: "名前は必須です",
  nameMaxLength: "名前が長すぎます",
  nameExists: "同じ名前の人物が既に存在します",
  parentMaxLength: "親の名前が長すぎます",
  parentSameAsPerson: "親の名前が本人と同じです",
  fixErrors: "エラーを修正してください",

  // Notifications
  graphUpdated: "グラフが更新されました",
  graphCleared: "グラフがクリアされました",
  noDataToClear: "クリアするデータがありません",
  familyExampleLoaded: "家族の例が読み込まれました",
  personNotFound: "人物が見つかりません",
  errorRendering: "表示エラー",
  errorUpdating: "更新エラー",
  errorSaving: "保存エラー",
  errorRemoving: "削除エラー",
  errorOpening: "開くエラー",
  errorClearing: "クリアエラー",
  errorInitializing: "初期化エラー",

  // Confirmations
  confirmRemove: "本当に削除しますか？",
  confirmClear: "全ての人物を削除しますか？",
  confirmFamilyExample: "家族の例を読み込みますか？",
  confirmResetFamilyExample: "家族の例をリセットしますか？",
  confirmLoadFamilyExample: "家族の例を読み込みますか？",
  resetFamilyExample: "家族の例をリセット",
  failedToResetFamilyExample: "家族の例のリセットに失敗しました",
  errorResetFamilyExample: "家族の例のリセットエラー",
  actionCannotBeUndone: "この操作は元に戻せません",

  // Placeholders and misc
  loadingGraph: "グラフを読み込み中...",
  reloadPage: "ページを再読み込み",
  initializationError: "初期化エラー",
  failedToLoad: "読み込みに失敗しました",
  errorRenderingGraph: "グラフ表示エラー",
  person: "人物",
  people: "人物",

  // Language switcher
  language: "言語",
  selectLanguage: "言語を選択",

  // Tree Management Dialog
  manageFamilyTrees: "家系管理",
  availableTrees: "利用可能な家系",
  createNewTree: "新しい家系を作成",
  createNewTreeMerging: "家系をマージして作成",
  copyCurrentTreeData: "現在の家系データをコピー",
  create: "作成",
  enterTreeName: "家系名を入力",
  currentActiveTree: "現在の家系",
  currentTree: "現在の家系",
  switchToTree: "家系を切り替え",
  deleteTree: "家系を削除",
  confirmDeleteTree: "本当に家系を削除しますか？",
  enterTreeNamePrompt: "家系名を入力してください",
  failedToSwitchTree: "家系の切り替えに失敗しました",
  failedToDeleteTree: "家系の削除に失敗しました",
  failedToCreateTree: "家系の作成に失敗しました",
  errorSwitchingTree: "家系切り替えエラー",
  errorDeletingTree: "家系削除エラー",
  errorCreatingTree: "家系作成エラー",

  // Tree validation errors
  treeNameEmpty: "家系名が空です",
  treeNameExists: "同じ家系名が既に存在します",
  treeNotFound: "家系が見つかりません",
  cannotDeleteFamilyExample: "家族の例は削除できません",
  cannotRenameFamilyExample: "家族の例は名前変更できません",

  // Tree merge and action tooltips
  selectedForMerge: "マージ対象",
  selectForMerge: "マージ対象を選択",
  clickToSwitchTo: "クリックして切り替え",

  // Footer
  projectInfo: "プロジェクト情報",
  developedBy: "開発者",
  sourceCode: "ソースコード",
  viewOnGitHub: "GitHubで見る",

  // Tree management notifications
  switchedToTree: "家系を切り替えました",
  errorUpdateAfterTreeChange: "家系変更後の更新エラー",
  errorLoadingFamilyExample: "家族の例の読み込みエラー",
  errorOpeningTreeManagement: "家系管理の開くエラー",
  errorOpeningFileManager: "ファイル管理の開くエラー",

  // File Manager
  manageFiles: "ファイル管理",
  downloadSection: "ダウンロード",
  uploadSection: "アップロード",
  downloadCurrentTree: "現在の家系をダウンロード",
  downloadAllTrees: "全家系をダウンロード",
  dragDropOrClick: "ドラッグ＆ドロップまたはクリック",
  selectFile: "ファイルを選択",
  uploadOptions: "アップロードオプション",
  mergeWithExisting: "既存とマージ",
  replaceExisting: "既存を置換",
  createNewTreeFile: "新しい家系ファイルを作成",
  confirmUpload: "アップロードを確認",
  fileInformation: "ファイル情報",
  fileName: "ファイル名",
  fileSize: "ファイルサイズ",
  fileType: "ファイルタイプ",
  singleTree: "単一家系",
  allTrees: "全家系",
  treeCount: "家系数",
  totalPersons: "総人物数",
  activeTree: "アクティブな家系",
  exportDate: "エクスポート日",
  personCount: "人物数",

  // File Manager notifications
  noTreeDataToDownload: "ダウンロードする家系データがありません",
  treeDownloaded: "家系がダウンロードされました",
  noTreesToDownload: "ダウンロードする家系がありません",
  allTreesDownloaded: "全家系がダウンロードされました",
  errorDownloadingTree: "家系のダウンロードエラー",
  errorDownloadingTrees: "全家系のダウンロードエラー",
  invalidFileType: "無効なファイルタイプ",
  invalidJsonFile: "無効なJSONファイル",
  noFileSelected: "ファイルが選択されていません",
  errorProcessingFile: "ファイル処理エラー",
  errorDuringUpload: "アップロード中のエラー",
  newTreeCreated: "新しい家系が作成されました",
  treeReplaced: "家系が置換されました",
  treeMerged: "家系がマージされました",
  allTreesImported: "全家系がインポートされました",

  // Print
  printGraph: "グラフを印刷",
  printGraphTooltip: "グラフを印刷します",
};

export default ja;
