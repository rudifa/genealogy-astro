import {describe, it, expect, beforeEach, vi} from "vitest";
import {App} from "../public/utility/App.js";
import {AppData} from "../public/utility/AppData.js";
import {AppLanguages} from "../public/utility/AppLanguages.js";
import {UIState} from "../public/utility/UIState.js";

describe("App Container", () => {
  beforeEach(() => {
    // Mock localStorage for the Node.js test environment
    const localStorageMock = (() => {
      let store = {};
      return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => {
          store[key] = value.toString();
        },
        clear: () => {
          store = {};
        },
        removeItem: (key) => {
          delete store[key];
        },
      };
    })();
    vi.stubGlobal("localStorage", localStorageMock);

    // Reset all singleton instances before each test to ensure true isolation
    App.instance = null;
    AppData._instance = null;
    AppLanguages._instance = null;
  });

  it("ensureAppExists should create a single instance (singleton pattern)", () => {
    const app1 = App.ensureAppExists();
    const app2 = App.ensureAppExists();

    expect(app1).toBeInstanceOf(App);
    expect(app1).toBe(app2); // Both variables should point to the exact same instance

    expect(app1.data).toBeInstanceOf(AppData);
    expect(app1.translations).toBeInstanceOf(AppLanguages);
    expect(app1.uiState).toBeInstanceOf(UIState);
    expect(app1).toBe(app2); // Both variables should point to the exact same instance
    expect(app1.data).toBe(app2.data); // Data slice should be the same
    expect(app1.translations).toBe(app2.translations); // Translations slice should be the same
    expect(app1.uiState).toBe(app2.uiState); // UI
  });

  it("ensureAppExists should create a single instance of its data and translations", () => {
    // Create instances of AppData and AppLanguages
    const data1 = AppData.ensureOneExists();
    const translations1 = AppLanguages.ensureOneExists();

    // Ensure they are singletons
    expect(data1).toBeInstanceOf(AppData);
    expect(translations1).toBeInstanceOf(AppLanguages);
    const app2 = App.ensureAppExists();
    expect(app2.data).toBe(data1); // Data slice should be the same
    expect(app2.translations).toBe(translations1); // Translations slice should be the same
  });

  it("should instantiate all state slices upon creation", () => {
    const app = App.ensureAppExists();

    expect(app.data).toBeDefined();
    expect(app.translations).toBeDefined();
    expect(app.uiState).toBeDefined();
  });

  it("should hold correct instances of each state slice", () => {
    const app = App.ensureAppExists();

    // Note: This test assumes that AppData and AppLanguages have been refactored
    // to have standard constructors, as per our plan.
    expect(app.data).toBeInstanceOf(AppData);
    expect(app.translations).toBeInstanceOf(AppLanguages);
    expect(app.uiState).toBeInstanceOf(UIState);
  });
});
