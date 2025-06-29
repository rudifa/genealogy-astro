export interface Person {
  name: string;
  mother?: string;
  father?: string;
}

export interface GenealogyData {
  persons: Person[];
}

// Tree storage structure
export interface TreeData {
  persons: Person[];
}

export interface StorageData {
  activeTreeName: string;
  trees: Record<string, TreeData>;
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
