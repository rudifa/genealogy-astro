// src/i18n/AppLanguages.js
// Simple Observer-based language manager for translations
import {translations as appTranslations, getTranslations as getAppTranslations} from "./index";

class AppLanguages {
  constructor() {
    this.currentLanguage = "en";
    // Use the app's translations by default
    this.translations = appTranslations;
    this.subscribers = new Set();
  }

  setTranslations(translations) {
    this.translations = translations;
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

// Singleton instance
export const appLanguages = new AppLanguages();
