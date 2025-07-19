// vitest/LanguageManager.test.js
import {describe, it, expect, vi, beforeEach} from "vitest";
import {AppLanguages} from "../public/utility/AppLanguages.js"; // exported instance

import {
  translations as appTranslations,
  getTranslations as getAppTranslations,
} from "../ts-dist/i18n/index.js"; // requires build, branch add-app-languages-8

// console.log("appTranslations:", appTranslations);

let verbose = false;

describe("AppLanguages singleton", () => {
  it("returns the same instance on multiple ensureOneExists calls", () => {
    const instance1 = AppLanguages.ensureOneExists(verbose);
    const instance2 = AppLanguages.ensureOneExists(verbose);
    expect(instance1).toBe(instance2);
  });

  it("throws if constructed directly", () => {
    // Clean up singleton for this test
    AppLanguages._instance = null;
    AppLanguages.ensureOneExists(verbose); // create singleton
    expect(() => new AppLanguages()).toThrow(
      "Use AppLanguages.ensureOneExists()"
    );
  });

  it("initializes with translations", () => {
    const instance = AppLanguages.ensureOneExists(verbose);
    instance.setTranslations(appTranslations);
    expect(instance.translations).toBeDefined();
    expect(instance.currentLanguage).toBe("en");
    // expect(instance.getTranslations()).toEqual(appTranslations);
    expect(instance.getAvailableLanguages()).toEqual(["en", "fr", "de", "ja"]);
  });
});

describe("AppLanguages", () => {
  let appLanguages;
  beforeEach(() => {
    AppLanguages._instance = null; // Reset singleton before each test
    appLanguages = AppLanguages.ensureOneExists(verbose);
    appLanguages.setTranslations(appTranslations);
    appLanguages.setLanguage("en");
    appLanguages.subscribers.clear();
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
    // console.log("appTranslations:", appTranslations);
    expect(appLanguages.getLanguage()).toBe("en");
    const fallback = appLanguages.getTranslations();
    // console.log("Fallback translations:", fallback);
    expect(typeof fallback).toBe("object");
    expect(fallback.addPerson).toBeDefined();
  });

  it("returns current language and translations (checks keys, not deep equality)", () => {
    expect(appLanguages.getLanguage()).toBe("en");
    const enTranslations = appLanguages.getTranslations();
    // Should have many keys (from app resources)
    expect(typeof enTranslations).toBe("object");
    expect(Object.keys(enTranslations).length).toBeGreaterThanOrEqual(139);
    // Check a known key
    expect(enTranslations.addPerson).toBeDefined();
    appLanguages.setLanguage("fr");
    expect(appLanguages.getLanguage()).toBe("fr");
    const frTranslations = appLanguages.getTranslations();
    expect(typeof frTranslations).toBe("object");
    expect(Object.keys(frTranslations).length).toBeGreaterThanOrEqual(139);
    expect(frTranslations.addPerson).toBeDefined();
  });

  it("notifies subscribers on language change", () => {
    const cb = vi.fn();
    appLanguages.subscribe(cb);
    // Should be called with 'en' and an object containing addPerson
    expect(cb).toHaveBeenCalledWith(
      "en",
      expect.objectContaining({addPerson: "Add Person"})
    );
    cb.mockClear();
    appLanguages.setLanguage("fr");
    expect(cb).toHaveBeenCalledWith(
      "fr",
      expect.objectContaining({addPerson: "Ajouter Personne"})
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
