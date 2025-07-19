// vitest/AppData.test.js

// Polyfill localStorage for Node.js/Vitest
if (typeof global.localStorage === "undefined") {
  global.localStorage = {
    _data: {},
    getItem(key) {
      return this._data[key] || null;
    },
    setItem(key, value) {
      this._data[key] = String(value);
    },
    removeItem(key) {
      delete this._data[key];
    },
    clear() {
      this._data = {};
    },
  };
}
import {describe, it, expect, beforeEach, beforeAll, vi} from "vitest";
import {GenealogyForestData} from "../public/utility/GenealogyForestData.js";
import {GenealogyTreeData} from "../public/utility/GenealogyTreeData.js";
import {AppData} from "../public/utility/AppData.js";

let verbose = false;

describe("AppData singleton", () => {
  it("returns the same instance on multiple ensureOneExists calls", () => {
    const instance1 = AppData.ensureOneExists(verbose);
    const instance2 = AppData.ensureOneExists(verbose);
    expect(instance1).toBe(instance2);
  });

  it("throws if constructed directly", () => {
    // Clean up singleton for this test
    AppData._instance = null;
    AppData.ensureOneExists(verbose); // create singleton
    expect(() => new AppData()).toThrow("Use AppData.ensureOneExists()");
  });

  it("initializes with sample family data", () => {
    const instance = AppData.ensureOneExists(verbose);
    expect(instance.state.genealogyData).toBeDefined();
    expect(instance.state.forestData).toBeDefined();
    expect(instance.state.currentTreeName).toBe("Family Example");
  });
});
describe("AppData", () => {
  beforeAll(() => {
    global.localStorage = {
      getItem: vi.fn(() => null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };
  });
  let appData;
  const initialTreeData = {persons: [{name: "Alice"}, {name: "Bob"}]};

  beforeEach(() => {
    AppData._instance = null; // Reset singleton before each test
    appData = AppData.ensureOneExists(verbose);
  });

  it("initializes state with initialize()", () => {
    appData.initialize(initialTreeData);
    expect(appData.state.forestData).toBeInstanceOf(GenealogyForestData);
    expect(appData.state.genealogyData).toBeInstanceOf(GenealogyTreeData);
    expect(appData.state.currentTreeName).toBe("Family Example");
    expect(appData.state.availableTrees).toContain("Family Example");

    expect(appData.state.isLoading).toBe(false);
  });

  it("subscribes and notifies callbacks", () => {
    const cb = vi.fn();
    appData.subscribe(cb);
    appData.notify();
    expect(cb).toHaveBeenCalledWith(appData.state);
  });

  it("addPerson adds a person", () => {
    appData.initialize(initialTreeData);
    appData.addPerson({name: "Charlie"});
    expect(appData.state.genealogyData.persons.length).toBe(3);
    expect(
      appData.state.genealogyData.persons.find((p) => p.name === "Charlie")
    ).not.toBeUndefined();
  });

  it("updatePerson updates a person", () => {
    appData.initialize(initialTreeData);
    appData.updatePerson("Alice", {name: "Alice", age: 30});
    expect(
      appData.state.genealogyData.persons.find((p) => p.name === "Alice").age
    ).toBe(30);
  });

  it("removePerson removes a person", () => {
    appData.initialize(initialTreeData);
    appData.removePerson("Bob");
    expect(
      appData.state.genealogyData.persons.find((p) => p.name === "Bob")
    ).toBeUndefined();
  });

  it("clearAllPersons clears all persons", () => {
    appData.initialize(initialTreeData);
    appData.clearAllPersons();
    expect(appData.state.genealogyData.persons.length).toBe(0);
  });

  it("switchToTree switches tree", () => {
    appData.initialize(initialTreeData);
    appData.state.forestData.createNewTree("Tree2", {persons: []});
    const result = appData.switchToTree("Tree2");
    expect(result).toBe(true);
    expect(appData.state.currentTreeName).toBe("Tree2");
  });

  it("createNewTree creates a new tree", () => {
    appData.initialize(initialTreeData);
    const result = appData.createNewTree("Tree3");
    expect(result).toBe(true);
    expect(appData.state.availableTrees).toContain("Tree3");
  });

  it("replaceCurrentTreeData replaces data", () => {
    appData.initialize(initialTreeData);
    appData.replaceCurrentTreeData([{name: "Zoe"}]);
    expect(appData.state.genealogyData.persons[0].name).toBe("Zoe");
  });

  it("mergeDataIntoCurrentTree merges data", () => {
    appData.initialize(initialTreeData);
    appData.mergeDataIntoCurrentTree([{name: "Eve"}]);
    expect(
      appData.state.genealogyData.persons.find((p) => p.name === "Eve")
    ).toBeDefined();
  });

  it("deleteTree deletes a tree", () => {
    appData.initialize(initialTreeData);
    appData.createNewTree("Tree4");
    const result = appData.deleteTree("Tree4");
    expect(result).toBe(true);
    expect(appData.state.availableTrees).not.toContain("Tree4");
  });

  it("resetFamilyExample resets data", () => {
    appData.initialize(initialTreeData);
    const result = appData.resetFamilyExample();
    expect(result).toBe(true);
  });

  it("getTreeData and getOriginalFamilyExampleData return data", () => {
    appData.initialize(initialTreeData);
    expect(appData.getTreeData("Family Example")).toEqual(initialTreeData);
    expect(appData.getOriginalFamilyExampleData()).toEqual(initialTreeData);
  });

  it("getState returns a copy of state", () => {
    appData.initialize(initialTreeData);
    const state = appData.getState();
    expect(state).not.toBe(appData.state);
    expect(state.currentTreeName).toBe("Family Example");
  });

  it("ensureOneExists returns the same instance on multiple calls", () => {
    const instance1 = AppData.ensureOneExists(verbose);
    const instance2 = AppData.ensureOneExists(verbose);
    expect(instance1).toBe(instance2);
  });
});
