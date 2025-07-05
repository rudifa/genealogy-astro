/**
 * GenealogyForestData handles the forest of genealogy trees.
 * Uses the browser's localStorage global API for persistent data storage.
 * Manages the ForestDataType structure: { selectedTreeName, trees: Record<string, TreeDataType> }
 *
 * Expected data structures (matching TypeScript interfaces):
 * - PersonType: { name: string, mother?: string, father?: string }
 * - TreeDataType: { persons: PersonType[] }
 * - ForestDataType: { selectedTreeName: string, trees: Record<string, TreeDataType> }
 */
export class GenealogyForestData {
  // Private fields
  #storageKey;
  #defaultTreeName;
  #defaultTreeData;
  #verbose;
  #currentTreeData;

  /**
   * @param {string} storageKey - The localStorage key to use
   * @param {string} defaultTreeName - The name of the default tree
   * @param {Object} defaultTreeData - Default tree data matching TreeDataType interface
   * @param {Array} defaultTreeData.persons - Array of person objects
   * @param {boolean} verbose - Whether to log success messages (default: true)
   */
  constructor(storageKey, defaultTreeName, defaultTreeData, verbose = true) {
    this.#storageKey = storageKey;
    this.#defaultTreeName = defaultTreeName;
    this.#defaultTreeData = defaultTreeData;
    this.#verbose = verbose;

    // Initialize current tree data from storage or create default
    if (this.#getStorageData() === null) {
      this.resetToDefault();
    }
    this.#currentTreeData = this.#getStorageData();
  }

  // Data persistence methods

  /**
   * Get raw storage data from localStorage
   * @returns {Object|null} Parsed storage data or null if not found/invalid
   * @private
   */
  #getStorageData() {
    try {
      const storedData = localStorage.getItem(this.#storageKey);
      if (storedData) {
        return JSON.parse(storedData);
      }
    } catch (error) {
      console.warn("Failed to parse stored data:", error);
    }
    return null;
  }

  /**
   * Write data to localStorage
   * @param {Object} data - The data to store
   * @private
   */
  #putToStorage(data) {
    localStorage.setItem(this.#storageKey, JSON.stringify(data));
  }

  /**
   * Initial storage structure with default tree
   * @returns {Object} Initial storage structure matching ForestDataType
   * @private
   */
  #initialForestDataStructure() {
    return {
      selectedTreeName: this.#defaultTreeName,
      trees: {
        [this.#defaultTreeName]: {
          persons: this.#defaultTreeData.persons || [],
        },
      },
    };
  }

  // Getter methods

  /**
   * Get the currently selected tree name (application working state)
   * @returns {string} Selected tree name
   */
  getSelectedTreeName() {
    return this.#currentTreeData?.selectedTreeName || this.#defaultTreeName;
  }

  /**
   * Get list of all available tree names
   * @returns {string[]} Array of tree names
   */
  getAvailableTrees() {
    try {
      if (this.#currentTreeData && this.#currentTreeData.trees) {
        return Object.keys(this.#currentTreeData.trees);
      }
    } catch (error) {
      console.error("Failed to get available trees:", error);
    }
    return [this.#defaultTreeName];
  }

  /**
   * Get tree data for a specific tree
   * @param {string} treeName - Name of the tree
   * @returns {Object|null} Tree data matching TreeDataType or null if not found
   */
  getTreeData(treeName) {
    if (this.#currentTreeData && this.#currentTreeData.trees && this.#currentTreeData.trees[treeName]) {
      return this.#currentTreeData.trees[treeName];
    }

    // Return default tree data if requesting default tree
    if (treeName === this.#defaultTreeName) {
      return this.#defaultTreeData;
    }

    return null;
  }

  /**
   * Get the currently selected tree data (application working state)
   * @returns {Object} Selected tree data matching TreeDataType
   */
  getActiveTreeData() {
    const currentTreeName = this.getSelectedTreeName();
    return this.getTreeData(currentTreeName) || this.#defaultTreeData;
  }

  /**
   * Check if a tree exists
   * @param {string} treeName - Name of the tree to check
   * @returns {boolean} True if tree exists
   */
  treeExists(treeName) {
    return !!(this.#currentTreeData && this.#currentTreeData.trees && this.#currentTreeData.trees[treeName]);
  }

  /**
   * Get storage statistics
   * @returns {Object} Storage statistics
   */
  getStorageStats() {
    if (!this.#currentTreeData || !this.#currentTreeData.trees) {
      return {
        treeCount: 0,
        totalPersons: 0,
        activeTree: this.#defaultTreeName,
        trees: {},
      };
    }

    const trees = {};
    let totalPersons = 0;

    Object.keys(this.#currentTreeData.trees).forEach((treeName) => {
      const personCount = this.#currentTreeData.trees[treeName].persons?.length || 0;
      trees[treeName] = {
        personCount,
        isActive: treeName === this.#currentTreeData.selectedTreeName,
      };
      totalPersons += personCount;
    });

    return {
      treeCount: Object.keys(this.#currentTreeData.trees).length,
      totalPersons,
      activeTree: this.#currentTreeData.selectedTreeName,
      trees,
    };
  }
  // Setter methods

  /**
   * Save tree data to storage
   * @param {string} treeName - Name of the tree
   * @param {Object} treeData - Tree data matching TreeDataType
   * @param {boolean} setAsActive - Whether to set this tree as the selected working tree
   */
  saveTreeData(treeName, treeData, setAsActive = false) {
    try {
      if (!this.#currentTreeData || !this.#currentTreeData.trees) {
        this.#currentTreeData = this.#initialForestDataStructure();
      }

      // Update the tree data
      this.#currentTreeData.trees[treeName] = {
        persons: treeData.persons || [],
      };

      // Set as selected if requested
      if (setAsActive) {
        this.#currentTreeData.selectedTreeName = treeName;
      }

      this.#putToStorage(this.#currentTreeData);
      if (this.#verbose) {
        console.log(
          `Saved data to localStorage for tree: ${treeName}, trees: ${Object.keys(
            this.#currentTreeData.trees
          )}`
        );
      }
    } catch (error) {
      console.error("Failed to save tree data to localStorage:", error);
      throw error;
    }
  }

  /**
   * Switch to a different tree (change application working state)
   * @param {string} treeName - Name of the tree to switch to
   * @returns {boolean} True if successful, false otherwise
   */
  switchToTree(treeName) {
    try {
      if (this.#currentTreeData && this.#currentTreeData.trees && this.#currentTreeData.trees[treeName]) {
        this.#currentTreeData.selectedTreeName = treeName;
        this.#putToStorage(this.#currentTreeData);
        if (this.#verbose) {
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

    if (!this.#currentTreeData || !this.#currentTreeData.trees) {
      this.#currentTreeData = this.#initialForestDataStructure();
    }

    if (this.#currentTreeData.trees[treeName]) {
      throw new Error(
        translations?.treeNameExists || "Tree with this name already exists"
      );
    }

    // Create new tree with source data or empty
    this.#currentTreeData.trees[treeName] = {
      persons: sourceTreeData ? [...(sourceTreeData.persons || [])] : [],
    };

    this.#putToStorage(this.#currentTreeData);
    if (this.#verbose) {
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
    if (treeName === this.#defaultTreeName) {
      const errorMessage =
        translations?.cannotDeleteFamilyExample ||
        `Cannot delete the ${this.#defaultTreeName} tree`;
      throw new Error(errorMessage);
    }

    if (!this.#currentTreeData || !this.#currentTreeData.trees || !this.#currentTreeData.trees[treeName]) {
      const errorMessage = translations?.treeNotFound || "Tree not found";
      throw new Error(errorMessage);
    }

    delete this.#currentTreeData.trees[treeName];

    // If we're deleting the selected tree, switch to default
    if (this.#currentTreeData.selectedTreeName === treeName) {
      this.#currentTreeData.selectedTreeName = this.#defaultTreeName;
      // Ensure default tree exists
      if (!this.#currentTreeData.trees[this.#defaultTreeName]) {
        this.#currentTreeData.trees[this.#defaultTreeName] = {
          persons: this.#defaultTreeData.persons || [],
        };
      }
    }

    this.#putToStorage(this.#currentTreeData);
    if (this.#verbose) {
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
      const errorMessage =
        translations?.treeNameEmpty || "Tree name cannot be empty";
      throw new Error(errorMessage);
    }

    newName = newName.trim();

    if (oldName === newName) {
      return true; // No change needed
    }

    if (oldName === this.#defaultTreeName) {
      const errorMessage =
        translations?.cannotRenameFamilyExample ||
        `Cannot rename the ${this.#defaultTreeName} tree`;
      throw new Error(errorMessage);
    }

    if (!this.#currentTreeData || !this.#currentTreeData.trees || !this.#currentTreeData.trees[oldName]) {
      const errorMessage = translations?.treeNotFound || "Tree not found";
      throw new Error(errorMessage);
    }

    if (this.#currentTreeData.trees[newName]) {
      const errorMessage =
        translations?.treeNameExists || "Tree with this name already exists";
      throw new Error(errorMessage);
    }

    // Copy tree data to new name
    this.#currentTreeData.trees[newName] = this.#currentTreeData.trees[oldName];
    delete this.#currentTreeData.trees[oldName];

    // Update selected tree name if necessary
    if (this.#currentTreeData.selectedTreeName === oldName) {
      this.#currentTreeData.selectedTreeName = newName;
    }

    this.#putToStorage(this.#currentTreeData);
    if (this.#verbose) {
      console.log(`Renamed tree from ${oldName} to ${newName}`);
    }
    return true;
  }

  /**
   * Reset storage to initial state with default tree
   */
  resetToDefault() {
    try {
      const initialStructure = this.#initialForestDataStructure();
      this.#putToStorage(initialStructure);
      this.#currentTreeData = initialStructure;
      if (this.#verbose) {
        console.log("Reset storage to default state");
      }
    } catch (error) {
      console.error("Failed to reset storage:", error);
    }
  }
}
