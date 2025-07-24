import {describe, it, expect, vi, beforeEach} from "vitest";
import {AppLanguages} from "../public/utility/AppLanguages.js";
import {
  translations as appTranslations,
  getTranslations as getAppTranslations,
} from "../public/i18n/index.js";

let verbose = false;
/** @constant {string} */
const LS_KEY = "app-language-storage-key";

// In-memory localStorage mock
function createLocalStorageMock() {
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
}

describe("AppLanguages singleton", () => {
  it("returns the same instance on multiple ensureOneExists calls", () => {
    AppLanguages._instance = null;
    const instance1 = AppLanguages.ensureOneExists(verbose);
    const instance2 = AppLanguages.ensureOneExists(verbose);
    expect(instance1).toBe(instance2);
  });

  it("throws if constructed directly", () => {
    AppLanguages._instance = null;
    AppLanguages.ensureOneExists(verbose);
    expect(() => new AppLanguages()).toThrow(
      "Use AppLanguages.ensureOneExists()"
    );
  });

  it("initializes with translations", () => {
    AppLanguages._instance = null;
    const instance = AppLanguages.ensureOneExists(verbose);
    instance.setAllTranslations(appTranslations);
    expect(instance.allTranslations).toBeDefined();
    expect(instance.currentLanguage).toBe("en");
    expect(instance.getAvailableLanguages()).toEqual(["en", "fr", "de", "ja"]);
  });
});

describe("AppLanguages getters with allTranslations==null (uninitialized", () => {
  let appLanguages;

  beforeEach(() => {
    global.window = {localStorage: createLocalStorageMock()};
    AppLanguages._instance = null;
    appLanguages = AppLanguages.ensureOneExists(verbose);
    // Do NOT call setAllTranslations here!
  });

  it("getAvailableLanguages returns undefined and logs error", () => {
    const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(appLanguages.getAvailableLanguages()).toBeUndefined();
    expect(spy).toHaveBeenCalledWith(
      "AppLanguages: allTranslations is undefined in getAvailableLanguages()",
      ""
    );
    spy.mockRestore();
  });

  it("getLanguage returns the currentLanguage (should be 'en')", () => {
    // currentLanguage is set in constructor, so this should NOT be undefined
    expect(appLanguages.getLanguage()).toBe("en");
  });

  it("getTranslations returns undefined and logs error", () => {
    const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(appLanguages.getTranslations()).toBeUndefined();
    expect(spy).toHaveBeenCalledWith(
      "AppLanguages: allTranslations is undefined in getTranslations()",
      ""
    );
    spy.mockRestore();
  });

  it("getAllTranslations returns undefined and logs error", () => {
    const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(appLanguages.getAllTranslations()).toBeUndefined();
    expect(spy).toHaveBeenCalledWith(
      "AppLanguages: allTranslations is undefined in getAllTranslations()",
      ""
    );
    spy.mockRestore();
  });
});

describe("AppLanguages with allTranslations initialized", () => {
  /** @type {AppLanguages} */
  let appLanguages;

  beforeEach(() => {
    // Always reset window and localStorage before each test
    global.window = {localStorage: createLocalStorageMock()};
    AppLanguages._instance = null;
    appLanguages = AppLanguages.ensureOneExists(verbose);
    appLanguages.setAllTranslations(appTranslations);
    appLanguages.setLanguage("en");
    appLanguages.subscribers.clear();
  });

  it("stores and recalls current language from localStorage", () => {
    appLanguages.setLanguage("fr");
    expect(window.localStorage.getItem(LS_KEY)).toBe("fr");

    // Simulate a new instance (reset singleton)
    AppLanguages._instance = null;
    const newInstance = AppLanguages.ensureOneExists(verbose);
    newInstance.setAllTranslations(appTranslations);
    expect(newInstance.getLanguage()).toBe("fr");
  });

  it("has several available languages", () => {
    expect(appLanguages.getLanguage()).toBe("en");
    const availableLangs = appLanguages.getAvailableLanguages();
    expect(availableLangs).toContain("en");
    expect(availableLangs).toContain("fr");
    expect(availableLangs).toContain("de");
    expect(availableLangs).toContain("ja");
  });

  it("sets and gets language among available languages", () => {
    expect(appLanguages.getLanguage()).toBe("en");
    appLanguages.setLanguage("fr");
    expect(appLanguages.getLanguage()).toBe("fr");
    appLanguages.setLanguage("de");
    expect(appLanguages.getLanguage()).toBe("de");
    appLanguages.setLanguage("ja");
    expect(appLanguages.getLanguage()).toBe("ja");
  });

  it("keeps language unchanged if new language is unavailable", () => {
    appLanguages.setLanguage("tlh");
    expect(appLanguages.getLanguage()).toBe("en");
    const fallback = appLanguages.getTranslations();
    expect(typeof fallback).toBe("object");
    expect(fallback.addPerson).toBeDefined();
  });

  it("returns current language and translations (checks keys, not deep equality)", () => {
    expect(appLanguages.getLanguage()).toBe("en");
    const enTranslations = appLanguages.getTranslations();
    expect(typeof enTranslations).toBe("object");
    expect(Object.keys(enTranslations).length).toBeGreaterThanOrEqual(139);
    expect(enTranslations.isoCode).toBe("en");
    expect(enTranslations.addPerson).toBeDefined();
    appLanguages.setLanguage("fr");
    expect(appLanguages.getLanguage()).toBe("fr");
    const frTranslations = appLanguages.getTranslations();
    expect(typeof frTranslations).toBe("object");
    expect(frTranslations.isoCode).toBe("fr");
    expect(Object.keys(frTranslations).length).toBeGreaterThanOrEqual(139);
    expect(frTranslations.addPerson).toBeDefined();
  });

  it("calls callback only if allTranslations is defined", () => {
    const cb = vi.fn();
    AppLanguages._instance = null;
    appLanguages = AppLanguages.ensureOneExists(verbose); // created without allTranslations
    appLanguages.subscribe(cb);
    appLanguages.notify();
    expect(cb).not.toHaveBeenCalled(); // No translations yet, so no callback call
    appLanguages.allTranslations = {
      en: {isoCode: "en", addPerson: "Add Person"},
    };
    appLanguages.notify();
    expect(cb).toHaveBeenCalledTimes(1); // Now it should be called
  });

  it("notifies subscribers on language change and calls the callback with current translations", () => {
    const cb = vi.fn();
    appLanguages.subscribe(cb);

    // Check initial call with English translations
    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb).toHaveBeenCalledWith(
      expect.objectContaining({
        addPerson: "Add Person",
        isoCode: "en",
      })
    );

    cb.mockClear();

    // Change language to French
    appLanguages.setLanguage("fr");

    // Check call with French translations
    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb).toHaveBeenCalledWith(
      expect.objectContaining({
        addPerson: "Ajouter Personne",
        isoCode: "fr",
      })
    );
  });

  it("unsubscribes correctly", () => {
    const cb = vi.fn();
    appLanguages.subscribe(cb);
    appLanguages.unsubscribe(cb);
    cb.mockClear();
    appLanguages.setLanguage("fr");
    expect(cb).not.toHaveBeenCalled();
  });
});
