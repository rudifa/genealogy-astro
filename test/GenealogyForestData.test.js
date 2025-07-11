import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { GenealogyForestData } from '../public/utility/GenealogyForestData.js';

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

// Mock CustomEvent and document for Node.js environment
global.CustomEvent = function(type, options) {
  this.type = type;
  this.detail = options ? options.detail : undefined;
};

global.document = {
  dispatchEvent: function(event) {
    // Default no-op implementation
  }
};

describe('GenealogyForestData', () => {
  let currentForestData;
  const testTreeData = {
    persons: [
      { name: "John Doe", mother: null, father: null },
      { name: "Jane Doe", mother: "Mary Smith", father: "John Doe" }
    ]
  };

  beforeEach(() => {
    // Clear localStorage before each test
    global.localStorage.clear();

    // Initialize fresh GenealogyForestData
    currentForestData = new GenealogyForestData(
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
      const treeName = currentForestData.getSelectedTreeName();
      assert.strictEqual(treeName, "Test Tree");
    });

    it('should return default tree in available trees list', () => {
      const trees = currentForestData.getAvailableTrees();
      assert.deepStrictEqual(trees, ["Test Tree"]);
    });

    it('should return default tree data when no storage exists', () => {
      const activeData = currentForestData.getActiveTreeData();
      assert.deepStrictEqual(activeData, testTreeData);
    });

    it('should get storage statistics correctly', () => {
      const stats = currentForestData.getStorageStats();
      assert.strictEqual(stats.treeCount, 1);
      assert.strictEqual(stats.totalPersons, 2);
      assert.strictEqual(stats.activeTree, "Test Tree");
      assert.deepStrictEqual(stats.trees, {
        "Test Tree": {
          personCount: 2,
          isActive: true
        }
      });
    });
  });

  describe('Tree Creation', () => {
    it('should create a new tree successfully', () => {
      const success = currentForestData.createNewTree("New Tree", testTreeData);
      assert.strictEqual(success, true);

      const trees = currentForestData.getAvailableTrees();
      assert.ok(trees.includes("New Tree"));
    });

    it('should create an empty tree when no source data provided', () => {
      const success = currentForestData.createNewTree("Empty Tree");
      assert.strictEqual(success, true);

      const treeData = currentForestData.getTreeData("Empty Tree");
      assert.deepStrictEqual(treeData.persons, []);
    });

    it('should throw error for empty tree name', () => {
      assert.throws(() => {
        currentForestData.createNewTree("");
      }, /Tree name cannot be empty/);

      assert.throws(() => {
        currentForestData.createNewTree("   ");
      }, /Tree name cannot be empty/);
    });

    it('should throw error for duplicate tree name', () => {
      currentForestData.createNewTree("Test Tree 2");

      assert.throws(() => {
        currentForestData.createNewTree("Test Tree 2");
      }, /Tree with this name already exists/);
    });

    it('should use translation messages when provided', () => {
      const translations = {
        treeNameEmpty: "Custom empty message",
        treeNameExists: "Custom exists message"
      };

      assert.throws(() => {
        currentForestData.createNewTree("", null, translations);
      }, /Custom empty message/);
    });
  });

  describe('Tree Switching', () => {
    beforeEach(() => {
      // Create a second tree for switching tests
      currentForestData.createNewTree("Second Tree", testTreeData);
    });

    it('should switch to existing tree successfully', () => {
      const success = currentForestData.switchToTree("Second Tree");
      assert.strictEqual(success, true);

      const currentTree = currentForestData.getSelectedTreeName();
      assert.strictEqual(currentTree, "Second Tree");
    });

    it('should return false when switching to non-existent tree', () => {
      const success = currentForestData.switchToTree("Non-existent Tree");
      assert.strictEqual(success, false);
    });

    it('should update storage stats after switching', () => {
      currentForestData.switchToTree("Second Tree");

      const stats = currentForestData.getStorageStats();
      assert.strictEqual(stats.activeTree, "Second Tree");
      assert.strictEqual(stats.trees["Second Tree"].isActive, true);
      assert.strictEqual(stats.trees["Test Tree"].isActive, false);
    });
  });

  describe('Tree Operations', () => {
    beforeEach(() => {
      currentForestData.createNewTree("Target Tree", testTreeData);
    });

    it('should rename tree successfully', () => {
      const success = currentForestData.renameTree("Target Tree", "Renamed Tree");
      assert.strictEqual(success, true);

      const trees = currentForestData.getAvailableTrees();
      assert.ok(trees.includes("Renamed Tree"));
      assert.ok(!trees.includes("Target Tree"));
    });

    it('should update active tree name when renaming active tree', () => {
      currentForestData.switchToTree("Target Tree");
      currentForestData.renameTree("Target Tree", "Renamed Tree");

      const currentTree = currentForestData.getSelectedTreeName();
      assert.strictEqual(currentTree, "Renamed Tree");
    });

    it('should delete tree successfully', () => {
      const success = currentForestData.deleteTree("Target Tree");
      assert.strictEqual(success, true);

      const trees = currentForestData.getAvailableTrees();
      assert.ok(!trees.includes("Target Tree"));
    });

    it('should switch to default when deleting active tree', () => {
      currentForestData.switchToTree("Target Tree");
      currentForestData.deleteTree("Target Tree");

      const currentTree = currentForestData.getSelectedTreeName();
      assert.strictEqual(currentTree, "Test Tree");
    });

    it('should throw error when trying to delete default tree', () => {
      assert.throws(() => {
        currentForestData.deleteTree("Test Tree");
      }, /Cannot delete the Test Tree tree/);
    });

    it('should throw error when trying to rename default tree', () => {
      assert.throws(() => {
        currentForestData.renameTree("Test Tree", "New Name");
      }, /Cannot rename the Test Tree tree/);
    });

    it('should handle rename with same name gracefully', () => {
      const success = currentForestData.renameTree("Target Tree", "Target Tree");
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

      currentForestData.saveTreeData("Test Tree", treeData, true);

      const retrievedData = currentForestData.getTreeData("Test Tree");
      assert.deepStrictEqual(retrievedData, treeData);
    });

    it('should update storage stats after saving data', () => {
      const treeData = {
        persons: [
          { name: "Alice", mother: null, father: null },
          { name: "Bob", mother: "Alice", father: null }
        ]
      };

      currentForestData.saveTreeData("Test Tree", treeData, true);

      const stats = currentForestData.getStorageStats();
      assert.strictEqual(stats.totalPersons, 2);
      assert.strictEqual(stats.trees["Test Tree"].personCount, 2);
    });
  });

  describe('Storage Management', () => {
    beforeEach(() => {
      // Set up some data
      currentForestData.createNewTree("Tree 1", testTreeData);
      currentForestData.createNewTree("Tree 2", testTreeData);
    });

    it('should reset to default state', () => {
      currentForestData.resetForestToDefault();

      const trees = currentForestData.getAvailableTrees();
      assert.deepStrictEqual(trees, ["Test Tree"]);

      const currentTree = currentForestData.getSelectedTreeName();
      assert.strictEqual(currentTree, "Test Tree");
    });

    it('should check tree existence correctly', () => {
      assert.strictEqual(currentForestData.treeExists("Tree 1"), true);
      assert.strictEqual(currentForestData.treeExists("Non-existent"), false);
    });
  });
});
