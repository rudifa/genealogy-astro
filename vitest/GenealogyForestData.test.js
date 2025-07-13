import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { GenealogyForestData } from '../public/utility/GenealogyForestData.js';

// Mock localStorage for Node.js environment
global.localStorage = {
  storage: {},
  getItem: function(key) { return this.storage[key] || null; },
  setItem: function(key, value) { this.storage[key] = value; },
  removeItem: function(key) { delete this.storage[key]; },
  clear: function() { this.storage = {}; }
};

// Mock CustomEvent and document for Node.js environment
global.CustomEvent = function(type, options) {
  this.type = type;
  this.detail = options ? options.detail : undefined;
};

global.document = {
  dispatchEvent: function(event) { /* no-op */ }
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
    global.localStorage.clear();
    currentForestData = new GenealogyForestData(
      "test-genealogy-data",
      "Test Tree",
      testTreeData,
      false
    );
  });

  afterEach(() => {
    global.localStorage.clear();
  });

  describe('Basic Operations', () => {
    it('should return default tree name when no data exists', () => {
      const treeName = currentForestData.getSelectedTreeName();
      expect(treeName).toBe("Test Tree");
    });

    it('should return default tree in available trees list', () => {
      const trees = currentForestData.getAvailableTrees();
      expect(trees).toEqual(["Test Tree"]);
    });

    it('should return default tree data when no storage exists', () => {
      const activeData = currentForestData.getActiveTreeData();
      expect(activeData).toEqual(testTreeData);
    });

    it('should get storage statistics correctly', () => {
      const stats = currentForestData.getStorageStats();
      expect(stats.treeCount).toBe(1);
      expect(stats.totalPersons).toBe(2);
      expect(stats.activeTree).toBe("Test Tree");
      expect(stats.trees).toEqual({
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
      expect(success).toBe(true);
      const trees = currentForestData.getAvailableTrees();
      expect(trees).toContain("New Tree");
    });

    it('should create an empty tree when no source data provided', () => {
      const success = currentForestData.createNewTree("Empty Tree");
      expect(success).toBe(true);
      const treeData = currentForestData.getTreeData("Empty Tree");
      expect(treeData.persons).toEqual([]);
    });

    it('should throw error for empty tree name', () => {
      expect(() => currentForestData.createNewTree("")).toThrow(/Tree name cannot be empty/);
      expect(() => currentForestData.createNewTree("   ")).toThrow(/Tree name cannot be empty/);
    });

    it('should throw error for duplicate tree name', () => {
      currentForestData.createNewTree("Test Tree 2");
      expect(() => currentForestData.createNewTree("Test Tree 2")).toThrow(/Tree with this name already exists/);
    });

    it('should use translation messages when provided', () => {
      const translations = {
        treeNameEmpty: "Custom empty message",
        treeNameExists: "Custom exists message"
      };
      expect(() => currentForestData.createNewTree("", null, translations)).toThrow(/Custom empty message/);
    });
  });

  describe('Tree Switching', () => {
    beforeEach(() => {
      currentForestData.createNewTree("Second Tree", testTreeData);
    });

    it('should switch to existing tree successfully', () => {
      const success = currentForestData.switchToTree("Second Tree");
      expect(success).toBe(true);
      const currentTree = currentForestData.getSelectedTreeName();
      expect(currentTree).toBe("Second Tree");
    });

    it('should return false when switching to non-existent tree', () => {
      const success = currentForestData.switchToTree("Non-existent Tree");
      expect(success).toBe(false);
    });

    it('should update storage stats after switching', () => {
      currentForestData.switchToTree("Second Tree");
      const stats = currentForestData.getStorageStats();
      expect(stats.activeTree).toBe("Second Tree");
      expect(stats.trees["Second Tree"].isActive).toBe(true);
      expect(stats.trees["Test Tree"].isActive).toBe(false);
    });
  });

  describe('Tree Operations', () => {
    beforeEach(() => {
      currentForestData.createNewTree("Target Tree", testTreeData);
    });

    it('should rename tree successfully', () => {
      const success = currentForestData.renameTree("Target Tree", "Renamed Tree");
      expect(success).toBe(true);
      const trees = currentForestData.getAvailableTrees();
      expect(trees).toContain("Renamed Tree");
      expect(trees).not.toContain("Target Tree");
    });

    it('should update active tree name when renaming active tree', () => {
      currentForestData.switchToTree("Target Tree");
      currentForestData.renameTree("Target Tree", "Renamed Tree");
      const currentTree = currentForestData.getSelectedTreeName();
      expect(currentTree).toBe("Renamed Tree");
    });

    it('should delete tree successfully', () => {
      const success = currentForestData.deleteTree("Target Tree");
      expect(success).toBe(true);
      const trees = currentForestData.getAvailableTrees();
      expect(trees).not.toContain("Target Tree");
    });

    it('should switch to default when deleting active tree', () => {
      currentForestData.switchToTree("Target Tree");
      currentForestData.deleteTree("Target Tree");
      const currentTree = currentForestData.getSelectedTreeName();
      expect(currentTree).toBe("Test Tree");
    });

    it('should throw error when trying to delete default tree', () => {
      expect(() => currentForestData.deleteTree("Test Tree")).toThrow(/Cannot delete the Test Tree tree/);
    });

    it('should throw error when trying to rename default tree', () => {
      expect(() => currentForestData.renameTree("Test Tree", "New Name")).toThrow(/Cannot rename the Test Tree tree/);
    });

    it('should handle rename with same name gracefully', () => {
      const success = currentForestData.renameTree("Target Tree", "Target Tree");
      expect(success).toBe(true);
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
      expect(retrievedData).toEqual(treeData);
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
      expect(stats.totalPersons).toBe(2);
      expect(stats.trees["Test Tree"].personCount).toBe(2);
    });
  });

  describe('Storage Management', () => {
    beforeEach(() => {
      currentForestData.createNewTree("Tree 1", testTreeData);
      currentForestData.createNewTree("Tree 2", testTreeData);
    });

    it('should reset to default state', () => {
      currentForestData.resetForestToDefault();
      const trees = currentForestData.getAvailableTrees();
      expect(trees).toEqual(["Test Tree"]);
      const currentTree = currentForestData.getSelectedTreeName();
      expect(currentTree).toBe("Test Tree");
    });

    it('should check tree existence correctly', () => {
      expect(currentForestData.treeExists("Tree 1")).toBe(true);
      expect(currentForestData.treeExists("Non-existent")).toBe(false);
    });
  });
});
