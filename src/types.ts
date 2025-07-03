export interface PersonType {
  name: string;
  mother?: string;
  father?: string;
  info?: string;
}

export interface TreeDataType {
  persons: PersonType[];
}

export interface StorageDataType {
  activeTreeName: string;
  trees: Record<string, TreeDataType>;
}

// Window extensions for tree management
declare global {
  interface Window {
    genealogyTreeManager?: {
      getCurrentTreeName(): string;
      getAvailableTrees(): string[];
      switchToTree(treeName: string): Promise<boolean>;
      createNewTree(
        treeName: string,
        copyFromCurrent?: boolean
      ): Promise<boolean>;
      deleteTree(treeName: string): Promise<boolean>;
      renameTree(oldName: string, newName: string): Promise<boolean>;
    };
    treeManagementDialog?: {
      show(): void;
      hide(): void;
      updateTreeList(): void;
    };
    genealogyDebug?: any;
    genealogyTranslations?: any;
    initializeEditDialog?: any;
  }
}
