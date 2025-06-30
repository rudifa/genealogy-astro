/**
 * StorageManager handles localStorage operations for genealogy tree data.
 * Uses the browser's localStorage global API for persistent data storage.
 * Manages the StorageDataType structure: { activeTreeName, trees: Record<string, TreeDataType> }
 *
 * Expected data structures (matching TypeScript interfaces):
 * - PersonType: { name: string, mother?: string, father?: string }
 * - TreeDataType: { persons: PersonType[] }
 * - StorageDataType: { activeTreeName: string, trees: Record<string, TreeDataType> }
 */
export class StorageManager {
  /**
   * @param {string} storageKey - The localStorage key to use
   * @param {string} defaultTreeName - The name of the default tree
   * @param {Object} defaultTreeData - Default tree data matching TreeDataType interface
   * @param {Array} defaultTreeData.persons - Array of person objects
   * @param {boolean} verbose - Whether to log success messages (default: true)
   */
  constructor(storageKey, defaultTreeName, defaultTreeData, verbose = true) {
    this.storageKey = storageKey;
    this.defaultTreeName = defaultTreeName;
    this.defaultTreeData = defaultTreeData;
    this.verbose = verbose;
  }

  /**
   * Get raw storage data from localStorage
   * @returns {Object|null} Parsed storage data or null if not found/invalid
   */
  getStorageData() {
    try {
      const storedData = localStorage.getItem(this.storageKey);
      if (storedData) {
        return JSON.parse(storedData);
      }
    } catch (error) {
      console.warn("Failed to parse stored data:", error);
    }
    return null;
  }

  /**
   * Initialize storage structure with default tree
   * @returns {Object} Initial storage structure matching StorageDataType
   */
  initializeStorageStructure() {
    return {
      activeTreeName: this.defaultTreeName,
      trees: {
        [this.defaultTreeName]: {
          persons: this.defaultTreeData.persons || [],
        },
      },
    };
  }

  /**
   * Get the current active tree name
   * @returns {string} Active tree name
   */
  getCurrentTreeName() {
    const storedData = this.getStorageData();
    return storedData?.activeTreeName || this.defaultTreeName;
  }

  /**
   * Get list of all available tree names
   * @returns {string[]} Array of tree names
   */
  getAvailableTrees() {
    try {
      const storedData = this.getStorageData();
      if (storedData && storedData.trees) {
        return Object.keys(storedData.trees);
      }
    } catch (error) {
      console.error("Failed to get available trees:", error);
    }
    return [this.defaultTreeName];
  }

  /**
   * Get tree data for a specific tree
   * @param {string} treeName - Name of the tree
   * @returns {Object|null} Tree data matching TreeDataType or null if not found
   */
  getTreeData(treeName) {
    const storedData = this.getStorageData();
    if (storedData && storedData.trees && storedData.trees[treeName]) {
      return storedData.trees[treeName];
    }

    // Return default tree data if requesting default tree
    if (treeName === this.defaultTreeName) {
      return this.defaultTreeData;
    }

    return null;
  }

  /**
   * Get the currently active tree data
   * @returns {Object} Active tree data matching TreeDataType
   */
  getActiveTreeData() {
    const currentTreeName = this.getCurrentTreeName();
    return this.getTreeData(currentTreeName) || this.defaultTreeData;
  }

  /**
   * Save tree data to storage
   * @param {string} treeName - Name of the tree
   * @param {Object} treeData - Tree data matching TreeDataType
   * @param {boolean} setAsActive - Whether to set this tree as active
   */
  saveTreeData(treeName, treeData, setAsActive = false) {
    try {
      let storedData = this.getStorageData();

      if (!storedData || !storedData.trees) {
        storedData = this.initializeStorageStructure();
      }

      // Update the tree data
      storedData.trees[treeName] = {
        persons: treeData.persons || [],
      };

      // Set as active if requested
      if (setAsActive) {
        storedData.activeTreeName = treeName;
      }

      localStorage.setItem(this.storageKey, JSON.stringify(storedData));
      if (this.verbose) {
        console.log(
          `Saved data to localStorage for tree: ${treeName}, trees: ${Object.keys(
            storedData.trees
          )}`
        );
      }
    } catch (error) {
      console.error("Failed to save tree data to localStorage:", error);
      throw error;
    }
  }

  /**
   * Switch to a different tree
   * @param {string} treeName - Name of the tree to switch to
   * @returns {boolean} True if successful, false otherwise
   */
  switchToTree(treeName) {
    try {
      const storedData = this.getStorageData();
      if (storedData && storedData.trees && storedData.trees[treeName]) {
        storedData.activeTreeName = treeName;
        localStorage.setItem(this.storageKey, JSON.stringify(storedData));
        if (this.verbose) {
          console.log(`Switched to tree: ${treeName}`);
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to switch tree:", error);
      return false;
    }
  }

  /**
   * Create a new tree
   * @param {string} treeName - Name of the new tree
   * @param {Object} sourceTreeData - Source tree data to copy (optional)
   * @param {Object} translations - Translation object for error messages (optional)
   * @returns {boolean} True if successful
   * @throws {Error} If tree name is invalid or already exists
   */
  createNewTree(treeName, sourceTreeData = null, translations = null) {
    if (!treeName || treeName.trim() === "") {
      throw new Error(
        translations?.treeNameEmpty || "Tree name cannot be empty"
      );
    }

    treeName = treeName.trim();

    let storedData = this.getStorageData();
    if (!storedData || !storedData.trees) {
      storedData = this.initializeStorageStructure();
    }

    if (storedData.trees[treeName]) {
      throw new Error(
        translations?.treeNameExists || "Tree with this name already exists"
      );
    }

    // Create new tree with source data or empty
    storedData.trees[treeName] = {
      persons: sourceTreeData ? [...(sourceTreeData.persons || [])] : [],
    };

    localStorage.setItem(this.storageKey, JSON.stringify(storedData));
    if (this.verbose) {
      console.log(`Created new tree: ${treeName}`);
    }
    return true;
  }

  /**
   * Delete a tree
   * @param {string} treeName - Name of the tree to delete
   * @param {Object} translations - Translation object for error messages
   * @returns {boolean} True if successful
   * @throws {Error} If tree cannot be deleted or not found
   */
  deleteTree(treeName, translations = null) {
    if (treeName === this.defaultTreeName) {
      const errorMessage = translations?.cannotDeleteFamilyExample || `Cannot delete the ${this.defaultTreeName} tree`;
      throw new Error(errorMessage);
    }

    const storedData = this.getStorageData();
    if (!storedData || !storedData.trees || !storedData.trees[treeName]) {
      const errorMessage = translations?.treeNotFound || "Tree not found";
      throw new Error(errorMessage);
    }

    delete storedData.trees[treeName];

    // If we're deleting the active tree, switch to default
    if (storedData.activeTreeName === treeName) {
      storedData.activeTreeName = this.defaultTreeName;
      // Ensure default tree exists
      if (!storedData.trees[this.defaultTreeName]) {
        storedData.trees[this.defaultTreeName] = {
          persons: this.defaultTreeData.persons || []
        };
      }
    }

    localStorage.setItem(this.storageKey, JSON.stringify(storedData));
    if (this.verbose) {
      console.log(`Deleted tree: ${treeName}`);
    }
    return true;
  }

  /**
   * Rename a tree
   * @param {string} oldName - Current name of the tree
   * @param {string} newName - New name for the tree
   * @param {Object} translations - Translation object for error messages
   * @returns {boolean} True if successful
   * @throws {Error} If rename operation fails
   */
  renameTree(oldName, newName, translations = null) {
    if (!newName || newName.trim() === "") {
      const errorMessage = translations?.treeNameEmpty || "Tree name cannot be empty";
      throw new Error(errorMessage);
    }

    newName = newName.trim();

    if (oldName === newName) {
      return true; // No change needed
    }

    if (oldName === this.defaultTreeName) {
      const errorMessage = translations?.cannotRenameFamilyExample || `Cannot rename the ${this.defaultTreeName} tree`;
      throw new Error(errorMessage);
    }

    const storedData = this.getStorageData();
    if (!storedData || !storedData.trees || !storedData.trees[oldName]) {
      const errorMessage = translations?.treeNotFound || "Tree not found";
      throw new Error(errorMessage);
    }

    if (storedData.trees[newName]) {
      const errorMessage = translations?.treeNameExists || "Tree with this name already exists";
      throw new Error(errorMessage);
    }

    // Copy tree data to new name
    storedData.trees[newName] = storedData.trees[oldName];
    delete storedData.trees[oldName];

    // Update active tree name if necessary
    if (storedData.activeTreeName === oldName) {
      storedData.activeTreeName = newName;
    }

    localStorage.setItem(this.storageKey, JSON.stringify(storedData));
    if (this.verbose) {
      console.log(`Renamed tree from ${oldName} to ${newName}`);
    }
    return true;
  }

  /**
   * Check if a tree exists
   * @param {string} treeName - Name of the tree to check
   * @returns {boolean} True if tree exists
   */
  treeExists(treeName) {
    const storedData = this.getStorageData();
    return !!(storedData && storedData.trees && storedData.trees[treeName]);
  }

  /**
   * Clear all storage data
   */
  clearStorage() {
    try {
      localStorage.removeItem(this.storageKey);
      if (this.verbose) {
        console.log("Cleared all storage data");
      }
    } catch (error) {
      console.error("Failed to clear storage:", error);
    }
  }

  /**
   * Reset storage to initial state with default tree
   */
  resetToDefault() {
    try {
      const initialStructure = this.initializeStorageStructure();
      localStorage.setItem(this.storageKey, JSON.stringify(initialStructure));
      if (this.verbose) {
        console.log("Reset storage to default state");
      }
    } catch (error) {
      console.error("Failed to reset storage:", error);
    }
  }

  /**
   * Get storage statistics
   * @returns {Object} Storage statistics
   */
  getStorageStats() {
    const storedData = this.getStorageData();
    if (!storedData || !storedData.trees) {
      return {
        treeCount: 0,
        totalPersons: 0,
        activeTree: this.defaultTreeName,
        trees: {}
      };
    }

    const trees = {};
    let totalPersons = 0;

    Object.keys(storedData.trees).forEach(treeName => {
      const personCount = storedData.trees[treeName].persons?.length || 0;
      trees[treeName] = {
        personCount,
        isActive: treeName === storedData.activeTreeName
      };
      totalPersons += personCount;
    });

    return {
      treeCount: Object.keys(storedData.trees).length,
      totalPersons,
      activeTree: storedData.activeTreeName,
      trees
    };
  }
}
