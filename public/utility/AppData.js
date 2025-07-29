import {GenealogyTreeData} from "./GenealogyTreeData.js";
import {GenealogyForestData} from "./GenealogyForestData.js";
import {getSampleFamily} from "./SampleFamily.js";

/*
 * AppData.js
 * manages the application state for genealogy data,
 * including the current tree and available trees.
 */
export class AppData {
  constructor() {
    if (AppData._instance) {
      throw new Error("Use AppData.ensureOneExists()");
    }
    // Initialize state and listeners as in the current object
    this.callbacks = new Set();
    this.state = {
      forestData: null,
      genealogyData: null,
      currentTreeName: "Family Example",
      availableTrees: [],
      isLoading: true,
      isEditDialogOpen: false,
      personToEdit: null,
    };
  }

  initialize(initialTreeData) {
    this.state.forestData = new GenealogyForestData(
      "genealogy-app-data",
      "Family Example",
      initialTreeData
    );
    this.state.currentTreeName = this.state.forestData.getSelectedTreeName();
    this.state.availableTrees = this.state.forestData.getAvailableTrees();
    const activeData = this.state.forestData.getActiveTreeData();
    this.state.genealogyData = new GenealogyTreeData(activeData);
    this.state.isLoading = false;
    this.notify();
  }

  static ensureOneExists(verbose = true) {
    if (!AppData._instance) {
      AppData._instance = new AppData();
      AppData._instance.initialize(getSampleFamily());

      if (verbose) {
        console.log(
          "🦋 AppData.ensureOneExists: instance created and initialized with sample family data"
        );
      }
    } else {
      if (verbose) {
        console.log("☘️ AppData.ensureOneExists: instance exists");
      }
    }
    if (verbose && typeof window !== "undefined") {
      window._appData = AppData._instance; // attach to window for inspection only
    }
    return AppData._instance;
  }

  /**
   * Subscribe a callback to state changes.
   * The callback will be called immediately with the current state,
   * and again whenever the state changes.
   * @param {function} callback - Function to call with the state object
   * @returns {function} Unsubscribe function
   */
  subscribe(callback) {
    this.callbacks.add(callback);
    callback(this.state);
    return () => this.callbacks.delete(callback);
  }

  /**
   * Notify all subscribed callbacks of a state change.
   * Calls each callback with the current state.
   * @private
   */
  notify() {
    for (const callback of this.callbacks) {
      callback(this.state);
    }
  }

  // --- Actions ---

  addPerson(person) {
    if (!this.state.genealogyData) return;
    this.state.genealogyData.addPerson(person);
    this.state.forestData.saveTreeData(
      this.state.currentTreeName,
      {persons: this.state.genealogyData.persons},
      true
    );
    this.notify();
  }

  updatePerson(originalName, updatedPerson) {
    if (!this.state.genealogyData) return;
    this.state.genealogyData.updatePerson(originalName, updatedPerson);
    this.state.forestData.saveTreeData(
      this.state.currentTreeName,
      {persons: this.state.genealogyData.persons},
      true
    );
    this.notify();
  }

  removePerson(personName) {
    if (!this.state.genealogyData) return;
    this.state.genealogyData.removePerson(personName);
    this.state.forestData.saveTreeData(
      this.state.currentTreeName,
      {persons: this.state.genealogyData.persons},
      true
    );
    this.notify();
  }

  clearAllPersons() {
    if (!this.state.genealogyData) return;
    this.state.genealogyData.clear();
    this.state.forestData.saveTreeData(
      this.state.currentTreeName,
      {persons: this.state.genealogyData.persons},
      true
    );
    this.notify();
  }

  // --- Tree Management Actions ---
  switchToTree(treeName) {
    if (this.state.forestData.switchToTree(treeName)) {
      this.state.currentTreeName = this.state.forestData.getSelectedTreeName();
      this.state.availableTrees = this.state.forestData.getAvailableTrees();
      const activeData = this.state.forestData.getActiveTreeData();
      this.state.genealogyData = new GenealogyTreeData(activeData);
      this.notify();
      return true;
    }
    return false;
  }

  createNewTree(treeName, copyCurrentData = false, customData = null) {
    if (!this.state.forestData) return false;
    let success = false;
    if (customData) {
      success = this.state.forestData.createNewTree(treeName, {
        persons: customData,
      });
    } else if (copyCurrentData) {
      success = this.state.forestData.createNewTree(treeName, {
        persons: this.state.genealogyData.persons,
      });
    } else {
      success = this.state.forestData.createNewTree(treeName, {persons: []});
    }
    if (success) {
      this.state.availableTrees = this.state.forestData.getAvailableTrees();
      this.notify();
    }
    return success;
  }

  replaceCurrentTreeData(personsData) {
    if (!this.state.genealogyData || !this.state.forestData) return false;
    this.state.genealogyData = new GenealogyTreeData({persons: personsData});
    this.state.forestData.saveTreeData(
      this.state.currentTreeName,
      {persons: personsData},
      true
    );
    this.notify();
    return true;
  }

  replaceTreeData(treeName, personsData) {
    if (!this.state.forestData) return false;
    const success = this.state.forestData.saveTreeData(
      treeName,
      {persons: personsData},
      true
    );
    if (success) {
      if (treeName === this.state.currentTreeName) {
        this.state.genealogyData = new GenealogyTreeData({
          persons: personsData,
        });
      }
      this.notify();
    }
    return success;
  }

  mergeDataIntoCurrentTree(newPersonsData) {
    if (!this.state.genealogyData) return false;
    const currentPersons = this.state.genealogyData.persons || [];
    const existingNames = new Set(currentPersons.map((p) => p.name));
    const mergedPersons = [...currentPersons];
    for (const person of newPersonsData) {
      if (!existingNames.has(person.name)) {
        mergedPersons.push(person);
        existingNames.add(person.name);
      }
    }
    this.state.genealogyData = new GenealogyTreeData({persons: mergedPersons});
    this.state.forestData.saveTreeData(
      this.state.currentTreeName,
      {persons: mergedPersons},
      true
    );
    this.notify();
    return true;
  }

  createTreeWithData(treeName, personsData) {
    if (!this.state.forestData) return false;
    const success = this.state.forestData.createNewTree(treeName, {
      persons: personsData,
    });
    if (success) {
      this.state.availableTrees = this.state.forestData.getAvailableTrees();
      this.notify();
    }
    return success;
  }

  deleteTree(treeName) {
    if (this.state.forestData.deleteTree(treeName)) {
      this.state.availableTrees = this.state.forestData.getAvailableTrees();
      if (treeName === this.state.currentTreeName) {
        this.switchToTree("Family Example");
      }
      this.notify();
      return true;
    }
    return false;
  }

  resetFamilyExample() {
    if (this.state.forestData.resetFamilyExample) {
      const success = this.state.forestData.resetFamilyExample();
      if (success) {
        if (this.state.currentTreeName === "Family Example") {
          const activeData = this.state.forestData.getActiveTreeData();
          this.state.genealogyData = new GenealogyTreeData(activeData);
        }
        this.notify();
      }
      return success;
    }
    return false;
  }

  // --- Data Access Methods ---
  getTreeData(treeName) {
    if (!this.state.forestData) return null;
    return this.state.forestData.getTreeData(treeName);
  }

  getOriginalFamilyExampleData() {
    if (
      !this.state.forestData ||
      !this.state.forestData.getOriginalFamilyExampleData
    )
      return null;
    return this.state.forestData.getOriginalFamilyExampleData();
  }

  getState() {
    return {...this.state};
  }
}
