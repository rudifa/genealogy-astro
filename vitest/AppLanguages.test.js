// vitest/LanguageManager.test.js
import {describe, it, expect, vi, beforeEach} from "vitest";
import {appLanguages} from "../src/i18n/AppLanguages.js";

describe("AppLanguages", () => {
  beforeEach(() => {
    appLanguages.setLanguage("en");
    appLanguages.subscribers.clear();
  });

  it ("has several available languages", () => {
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
