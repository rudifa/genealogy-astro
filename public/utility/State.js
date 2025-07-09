import { GenealogyTreeData } from "/utility/GenealogyTreeData.js";
import { GenealogyForestData } from "/utility/GenealogyForestData.js";

// --- Private state and helpers ---
const listeners = new Set();

const state = {
    forestData: null,
    genealogyData: null,
    currentTreeName: 'Family Example',
    availableTrees: [],
    isLoading: true,
    isEditDialogOpen: false,
    personToEdit: null,
    translations: {},
};

function notify() {
    for (const listener of listeners) {
        listener(state);
    }
}

// --- Public State Object ---
export const appState = {
    // --- Subscription ---
    subscribe(listener) {
        listeners.add(listener);
        listener(state); // Immediately notify with current state
        return () => listeners.delete(listener); // Return an unsubscribe function
    },

    // --- Actions ---
    initialize(initialTreeData, initialTranslations) {
        state.forestData = new GenealogyForestData(
            "genealogy-app-data",
            "Family Example",
            initialTreeData
        );
        state.currentTreeName = state.forestData.getSelectedTreeName();
        state.availableTrees = state.forestData.getAvailableTrees();
        const activeData = state.forestData.getActiveTreeData();
        state.genealogyData = new GenealogyTreeData(activeData);
        state.translations = initialTranslations; // Accept translations directly
        state.isLoading = false;
        notify();
    },

    setLanguage(lang, translations) {
        // If translations is an object with language keys, use the specific language
        if (translations && typeof translations === 'object' && translations[lang]) {
            state.translations = translations[lang];
        } else {
            // Otherwise, assume translations is already for the specific language
            state.translations = translations || state.translations;
        }
        notify();
    },

    openEditDialog(person) {
        state.personToEdit = person;
        state.isEditDialogOpen = true;
        notify();
    },

    closeEditDialog() {
        state.isEditDialogOpen = false;
        state.personToEdit = null;
        notify();
    },

    updatePerson(originalName, updatedPerson) {
        state.genealogyData.updatePerson(originalName, updatedPerson);
        state.forestData.saveTreeData(state.currentTreeName, { persons: state.genealogyData.persons }, true);
        notify();
    },

    removePerson(personName) {
        state.genealogyData.removePerson(personName);
        state.forestData.saveTreeData(state.currentTreeName, { persons: state.genealogyData.persons }, true);
        notify();
    },

    clearAllPersons() {
        state.genealogyData.clear();
        state.forestData.saveTreeData(state.currentTreeName, { persons: state.genealogyData.persons }, true);
        notify();
    },

    // --- Tree Management Actions ---
    switchToTree(treeName) {
        if (state.forestData.switchToTree(treeName)) {
            state.currentTreeName = state.forestData.getSelectedTreeName();
            state.availableTrees = state.forestData.getAvailableTrees();
            const activeData = state.forestData.getActiveTreeData();
            state.genealogyData = new GenealogyTreeData(activeData);
            notify();
            return true;
        }
        return false;
    },

    createNewTree(treeName, copyCurrentData = false, customData = null) {
        if (!state.forestData) {
            console.error("State not initialized: forestData is null");
            return false;
        }

        let success = false;
        if (customData) {
            // Create tree with custom data (e.g., merged data)
            success = state.forestData.createNewTree(treeName, { persons: customData });
        } else if (copyCurrentData) {
            // Create tree with copy of current data
            success = state.forestData.createNewTree(treeName, { persons: state.genealogyData.persons });
        } else {
            // Create empty tree
            success = state.forestData.createNewTree(treeName, { persons: [] });
        }

        if (success) {
            state.availableTrees = state.forestData.getAvailableTrees();
            notify();
        }
        return success;
    },

    replaceCurrentTreeData(personsData) {
        if (!state.genealogyData || !state.forestData) {
            console.error("State not initialized");
            return false;
        }

        state.genealogyData = new GenealogyTreeData({ persons: personsData });
        state.forestData.saveTreeData(state.currentTreeName, { persons: personsData }, true);
        notify();
        return true;
    },

    replaceTreeData(treeName, personsData) {
        if (!state.forestData) {
            console.error("State not initialized: forestData is null");
            return false;
        }

        const success = state.forestData.saveTreeData(treeName, { persons: personsData }, true);
        if (success) {
            // If we're currently viewing this tree, update the current data
            if (treeName === state.currentTreeName) {
                state.genealogyData = new GenealogyTreeData({ persons: personsData });
            }
            notify();
        }
        return success;
    },

    mergeDataIntoCurrentTree(newPersonsData) {
        if (!state.genealogyData) {
            console.error("State not initialized");
            return false;
        }

        const currentPersons = state.genealogyData.persons || [];
        const existingNames = new Set(currentPersons.map(p => p.name));

        const mergedPersons = [...currentPersons];
        for (const person of newPersonsData) {
            if (!existingNames.has(person.name)) {
                mergedPersons.push(person);
                existingNames.add(person.name);
            }
        }

        state.genealogyData = new GenealogyTreeData({ persons: mergedPersons });
        state.forestData.saveTreeData(state.currentTreeName, { persons: mergedPersons }, true);
        notify();
        return true;
    },

    createTreeWithData(treeName, personsData) {
        if (!state.forestData) {
            console.error("State not initialized: forestData is null");
            return false;
        }

        const success = state.forestData.createNewTree(treeName, { persons: personsData });
        if (success) {
            state.availableTrees = state.forestData.getAvailableTrees();
            notify();
        }
        return success;
    },

    deleteTree(treeName) {
        if (state.forestData.deleteTree(treeName)) {
            state.availableTrees = state.forestData.getAvailableTrees();
            // If we deleted the current tree, switch to Family Example
            if (treeName === state.currentTreeName) {
                this.switchToTree('Family Example');
            }
            notify();
            return true;
        }
        return false;
    },

    resetFamilyExample() {
        if (state.forestData.resetFamilyExample) {
            const success = state.forestData.resetFamilyExample();
            if (success) {
                // Refresh current data if we're viewing Family Example
                if (state.currentTreeName === 'Family Example') {
                    const activeData = state.forestData.getActiveTreeData();
                    state.genealogyData = new GenealogyTreeData(activeData);
                }
                notify();
            }
            return success;
        }
        return false;
    },

    // --- Data Access Methods ---
    getTreeData(treeName) {
        return state.forestData.getTreeData(treeName);
    },

    getOriginalFamilyExampleData() {
        return state.forestData.getOriginalFamilyExampleData ?
            state.forestData.getOriginalFamilyExampleData() : null;
    },

    // --- Getters ---
    getState() {
        return { ...state };
    }
};

// Make it globally accessible for easy debugging, but in a controlled way
window.appState = appState;
