// src/i18n/AppLanguages.js
// Simple Observer-based language manager for translations
// import {translations as appTranslations, getTranslations as getAppTranslations} from "./index";

const verbose = false;

export class AppLanguages {
  constructor() {
    if (AppLanguages._instance) {
      throw new Error("Use AppLanguages.ensureOneExists()");
    }
    this.currentLanguage = "en";
    // Use the app's translations by default
    this.translations = null;
    this.subscribers = new Set();
  }

  static ensureOneExists(verbose = true) {
    if (!AppLanguages._instance) {
      AppLanguages._instance = new AppLanguages();
      if (verbose && typeof window !== "undefined") {
        window.appLanguages = AppLanguages._instance; // attach to window for inspection
      }
      if (verbose) {
        console.log(
          "🌐 AppLanguages.ensureOneExists: instance created (uninitialized)"
        );
      }
    } else {
      if (verbose && typeof window !== "undefined") {
        window.appLanguages = AppLanguages._instance; // attach to window for inspection
      }
      if (verbose) {
        console.log("🌍 AppLanguages.ensureOneExists: instance exists");
      }
    }
    return AppLanguages._instance;
  }

  setTranslations(translations) {
    this.translations = translations;


    if (verbose) {
      console.log(
        "🌍 AppLanguages.setTranslations: translations set",
        !!translations
      );
    }

    this.notify();
  }

  setLanguage(lang) {
    // Only set if the language is available in translations
    const availableLangs = Object.keys(this.translations);
    if (!availableLangs.includes(lang)) {
      // Language not available, do nothing
      return;
    }
    if (this.currentLanguage !== lang) {
      this.currentLanguage = lang;
      this.notify();
    }
  }
  getAvailableLanguages() {
    if (!this.translations) {
      return [];
    }
    // Return the keys of the translations object as available languages
    return Object.keys(this.translations);
  }

  getLanguage() {
    return this.currentLanguage;
  }

  getTranslations() {
    // Use getAppTranslations for fallback logic
    if (typeof getAppTranslations === "function") {
      return getAppTranslations(this.currentLanguage);
    }
    if (!this.translations) {
      return {};
    }
    return (
      this.translations[this.currentLanguage] || this.translations["en"] || {}
    );
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    // Immediately call with current state
    callback(this.getLanguage(), this.getTranslations());
  }

  unsubscribe(callback) {
    this.subscribers.delete(callback);
  }

  notify() {
    for (const cb of this.subscribers) {
      cb(this.getLanguage(), this.getTranslations());
    }
  }
}

// use AppLanguages.ensureOneExists() to get the singleton instance
// export const appLanguages = AppLanguages.ensureOneExists();
