// vitest/AppDataLoader.test.js
import {describe, it, expect, vi, beforeEach} from "vitest";

// Use relative path for ESM import
import {appDataEnsureExists} from "../public/utility/AppDataCreator.js";
import {getSampleFamily} from "../public/utility/SampleFamily.js";
import {AppData} from "../public/utility/AppData.js";
import {GenealogyForestData} from "../public/utility/GenealogyForestData.js";
import {GenealogyTreeData} from "../public/utility/GenealogyTreeData.js";

// Mock fetch for loadSampleTree
const mockJson = {persons: [{name: "John Doe"}]};

beforeEach(() => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockJson),
      text: () => Promise.resolve(JSON.stringify(mockJson)),
    })
  );
  // Mock window object for browser globals
  global.window = {};
  delete global.window.appData;

  // Mock localStorage for browser-only code
  global.localStorage = {
    getItem: vi.fn(() => null),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  };
});

describe("getSampleFamily", () => {
  it("returns a sample family object with persons array", () => {
    const family = getSampleFamily();
    expect(family).toBeDefined();
    expect(typeof family).toBe("object");
    expect(Array.isArray(family.persons)).toBe(true);
    expect(family.persons.length).toBeGreaterThan(0);
  });
});

describe("appDataEnsureExists", () => {
  it("creates window.appData and initializes it (real AppData)", async () => {
    // Patch global.AppData to the real AppData class
    global.AppData = AppData;
    const appData = await appDataEnsureExists();
    expect(appData).toBeInstanceOf(AppData);
    // Check that genealogyData is initialized with mockJson
    expect(appData.state.genealogyData).toBeDefined();
    expect(
      appData.state.genealogyData.persons ||
        appData.state.genealogyData._persons
    ).toBeDefined();
    expect(window.appData).toBe(appData);
  });

  it("returns existing window.appData if already set", async () => {
    const fake = {foo: 1};
    window.appData = fake;
    const result = await appDataEnsureExists();
    expect(result).toBe(fake);
  });
});
