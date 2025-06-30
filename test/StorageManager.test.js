import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { StorageManager } from '../public/utility/StorageManager.js';

// Mock localStorage for Node.js environment
global.localStorage = {
  storage: {},
  getItem: function(key) {
    return this.storage[key] || null;
  },
  setItem: function(key, value) {
    this.storage[key] = value;
  },
  removeItem: function(key) {
    delete this.storage[key];
  },
  clear: function() {
    this.storage = {};
  }
};

describe('StorageManager', () => {
  let storageManager;
  const testTreeData = {
    persons: [
      { name: "John Doe", mother: null, father: null },
      { name: "Jane Doe", mother: "Mary Smith", father: "John Doe" }
    ]
  };

  beforeEach(() => {
    // Clear localStorage before each test
    global.localStorage.clear();

    // Initialize fresh StorageManager
    storageManager = new StorageManager(
      "test-genealogy-data",
      "Test Tree",
      testTreeData,
      false // verbose = false to reduce console noise during tests
    );
  });

  afterEach(() => {
    // Clean up after each test
    global.localStorage.clear();
  });

  describe('Basic Operations', () => {
    it('should return default tree name when no data exists', () => {
      const treeName = storageManager.getCurrentTreeName();
      assert.strictEqual(treeName, "Test Tree");
    });

    it('should return default tree in available trees list', () => {
      const trees = storageManager.getAvailableTrees();
      assert.deepStrictEqual(trees, ["Test Tree"]);
    });

    it('should return default tree data when no storage exists', () => {
      const activeData = storageManager.getActiveTreeData();
      assert.deepStrictEqual(activeData, testTreeData);
    });

    it('should get storage statistics correctly', () => {
      const stats = storageManager.getStorageStats();
      assert.strictEqual(stats.treeCount, 0);
      assert.strictEqual(stats.totalPersons, 0);
      assert.strictEqual(stats.activeTree, "Test Tree");
      assert.deepStrictEqual(stats.trees, {});
    });
  });

  describe('Tree Creation', () => {
    it('should create a new tree successfully', () => {
      const success = storageManager.createNewTree("New Tree", testTreeData);
      assert.strictEqual(success, true);

      const trees = storageManager.getAvailableTrees();
      assert.ok(trees.includes("New Tree"));
    });

    it('should create an empty tree when no source data provided', () => {
      const success = storageManager.createNewTree("Empty Tree");
      assert.strictEqual(success, true);

      const treeData = storageManager.getTreeData("Empty Tree");
      assert.deepStrictEqual(treeData.persons, []);
    });

    it('should throw error for empty tree name', () => {
      assert.throws(() => {
        storageManager.createNewTree("");
      }, /Tree name cannot be empty/);

      assert.throws(() => {
        storageManager.createNewTree("   ");
      }, /Tree name cannot be empty/);
    });

    it('should throw error for duplicate tree name', () => {
      storageManager.createNewTree("Test Tree 2");

      assert.throws(() => {
        storageManager.createNewTree("Test Tree 2");
      }, /Tree with this name already exists/);
    });

    it('should use translation messages when provided', () => {
      const translations = {
        treeNameEmpty: "Custom empty message",
        treeNameExists: "Custom exists message"
      };

      assert.throws(() => {
        storageManager.createNewTree("", null, translations);
      }, /Custom empty message/);
    });
  });

  describe('Tree Switching', () => {
    beforeEach(() => {
      // Create a second tree for switching tests
      storageManager.createNewTree("Second Tree", testTreeData);
    });

    it('should switch to existing tree successfully', () => {
      const success = storageManager.switchToTree("Second Tree");
      assert.strictEqual(success, true);

      const currentTree = storageManager.getCurrentTreeName();
      assert.strictEqual(currentTree, "Second Tree");
    });

    it('should return false when switching to non-existent tree', () => {
      const success = storageManager.switchToTree("Non-existent Tree");
      assert.strictEqual(success, false);
    });

    it('should update storage stats after switching', () => {
      storageManager.switchToTree("Second Tree");

      const stats = storageManager.getStorageStats();
      assert.strictEqual(stats.activeTree, "Second Tree");
      assert.strictEqual(stats.trees["Second Tree"].isActive, true);
      assert.strictEqual(stats.trees["Test Tree"].isActive, false);
    });
  });

  describe('Tree Operations', () => {
    beforeEach(() => {
      storageManager.createNewTree("Target Tree", testTreeData);
    });

    it('should rename tree successfully', () => {
      const success = storageManager.renameTree("Target Tree", "Renamed Tree");
      assert.strictEqual(success, true);

      const trees = storageManager.getAvailableTrees();
      assert.ok(trees.includes("Renamed Tree"));
      assert.ok(!trees.includes("Target Tree"));
    });

    it('should update active tree name when renaming active tree', () => {
      storageManager.switchToTree("Target Tree");
      storageManager.renameTree("Target Tree", "Renamed Tree");

      const currentTree = storageManager.getCurrentTreeName();
      assert.strictEqual(currentTree, "Renamed Tree");
    });

    it('should delete tree successfully', () => {
      const success = storageManager.deleteTree("Target Tree");
      assert.strictEqual(success, true);

      const trees = storageManager.getAvailableTrees();
      assert.ok(!trees.includes("Target Tree"));
    });

    it('should switch to default when deleting active tree', () => {
      storageManager.switchToTree("Target Tree");
      storageManager.deleteTree("Target Tree");

      const currentTree = storageManager.getCurrentTreeName();
      assert.strictEqual(currentTree, "Test Tree");
    });

    it('should throw error when trying to delete default tree', () => {
      assert.throws(() => {
        storageManager.deleteTree("Test Tree");
      }, /Cannot delete the Test Tree tree/);
    });

    it('should throw error when trying to rename default tree', () => {
      assert.throws(() => {
        storageManager.renameTree("Test Tree", "New Name");
      }, /Cannot rename the Test Tree tree/);
    });

    it('should handle rename with same name gracefully', () => {
      const success = storageManager.renameTree("Target Tree", "Target Tree");
      assert.strictEqual(success, true);
    });
  });

  describe('Data Persistence', () => {
    it('should save and retrieve tree data correctly', () => {
      const treeData = {
        persons: [
          { name: "Alice", mother: null, father: null },
          { name: "Bob", mother: "Alice", father: null }
        ]
      };

      storageManager.saveTreeData("Test Tree", treeData, true);

      const retrievedData = storageManager.getTreeData("Test Tree");
      assert.deepStrictEqual(retrievedData, treeData);
    });

    it('should update storage stats after saving data', () => {
      const treeData = {
        persons: [
          { name: "Alice", mother: null, father: null },
          { name: "Bob", mother: "Alice", father: null }
        ]
      };

      storageManager.saveTreeData("Test Tree", treeData, true);

      const stats = storageManager.getStorageStats();
      assert.strictEqual(stats.totalPersons, 2);
      assert.strictEqual(stats.trees["Test Tree"].personCount, 2);
    });
  });

  describe('Storage Management', () => {
    beforeEach(() => {
      // Set up some data
      storageManager.createNewTree("Tree 1", testTreeData);
      storageManager.createNewTree("Tree 2", testTreeData);
    });

    it('should clear all storage data', () => {
      storageManager.clearStorage();

      const data = storageManager.getStorageData();
      assert.strictEqual(data, null);
    });

    it('should reset to default state', () => {
      storageManager.resetToDefault();

      const trees = storageManager.getAvailableTrees();
      assert.deepStrictEqual(trees, ["Test Tree"]);

      const currentTree = storageManager.getCurrentTreeName();
      assert.strictEqual(currentTree, "Test Tree");
    });

    it('should check tree existence correctly', () => {
      assert.strictEqual(storageManager.treeExists("Tree 1"), true);
      assert.strictEqual(storageManager.treeExists("Non-existent"), false);
    });
  });
});
